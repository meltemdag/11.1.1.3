/**
 * MEBİ Bütünleşik SCORM Entegrasyon Servisi (v3.0)
 * 
 * GELİŞTİRİCİ NOTU:
 * Entegrasyon esnasında ve etkinlik kaynak kodlarında konsola kesinlikle
 * SCORM logu (console.log, console.info, console.warn vb.) eklenmemelidir.
 * 
 * Öncelik Sırası:
 *   1. MEBİ (e-Yaygın / EBA) → onCompleted özel kanalı
 *   2. Standart SCORM 2004   → API_1484_11
 *   3. Standart SCORM 1.2    → API
 *   4. Sandbox Modu           → Konsol simülasyonu (LMS yoksa)
 * 
 * Ek Yetenekler:
 *   - Etkinlik ilerleme kaydetme / geri yükleme (suspend_data)
 *   - Adım takibi (lesson_location)
 *   - Dinamik puan ölçekleme (URL parametresinden)
 *   - ISO 8601 oturum süresi takibi
 *   - Sessiz çalışma modu (LMS aktifken)
 * 
 * Harici kütüphane gerektirmez. Tek dosyada çalışır.
 */

(function (window) {
    'use strict';

    // ─────────────────────────────────────────────
    //  Dahili Durum Değişkenleri
    // ─────────────────────────────────────────────
    var startTime = null;
    var activeChannel = null;   // 'mebi' | 'scorm2004' | 'scorm12' | null
    var scormAPI = null;        // Standart SCORM API nesnesi
    var isInitialized = false;

    // Sandbox modu için yerel depolama (LMS yokken ilerleme takibi)
    var sandboxStore = {};

    // ─────────────────────────────────────────────
    //  Yardımcı Fonksiyonlar
    // ─────────────────────────────────────────────

    /**
     * ISO 8601 süre formatlayıcı.
     * initialize() çağrısından itibaren geçen süreyi hesaplar.
     * Örnek çıktı: PT1H5M32S
     */
    function getDurationString() {
        if (!startTime) return 'PT0M30S';
        var totalSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        var result = 'PT';
        if (hours > 0) result += hours + 'H';
        if (minutes > 0 || hours > 0) result += minutes + 'M';
        result += seconds + 'S';
        return result;
    }

    /**
     * Renkli konsol loglama aracı.
     * MEBİ/LMS ortamı aktifken yalnızca hata logları gösterilir (Sessiz Çalışma).
     * Sandbox modunda tüm loglar görünür.
     */
    function log(message, type) {
        type = type || 'info';

        // Aktif kanal varsa ve hata değilse → sessiz kal
        if (activeChannel && type !== 'error') return;

        var colors = {
            error:   '#ef4444',
            success: '#10b981',
            warning: '#f59e0b',
            info:    '#6366f1'
        };

        console.log(
            '%c[SCORM] %c' + message,
            'color: ' + (colors[type] || colors.info) + '; font-weight: bold;',
            'color: inherit;'
        );
    }

    // ─────────────────────────────────────────────
    //  Kanal Algılama Fonksiyonları
    // ─────────────────────────────────────────────

    /**
     * MEBİ onCompleted kanalını arar.
     * Arama sırası: frmApp-0 iframe → mevcut window → parent → top
     * @returns {Window|null} onCompleted fonksiyonunu barındıran pencere
     */
    function findMebiAPI() {
        try {
            // 1. MEBİ'in standart iframe'i: frmApp-0
            try {
                var targetWindow = window.parent &&
                    window.parent.document &&
                    window.parent.document.getElementById('frmApp-0');
                if (targetWindow && targetWindow.contentWindow &&
                    typeof targetWindow.contentWindow.onCompleted === 'function') {
                    return targetWindow.contentWindow;
                }
            } catch (e) {
                // CORS engeli — sessizce geç
            }

            // 2. Mevcut pencere
            if (typeof window.onCompleted === 'function') {
                return window;
            }

            // 3. Üst pencereler
            try {
                if (window.parent && window.parent !== window &&
                    typeof window.parent.onCompleted === 'function') {
                    return window.parent;
                }
            } catch (e) { /* CORS */ }

            try {
                if (window.top && window.top !== window &&
                    typeof window.top.onCompleted === 'function') {
                    return window.top;
                }
            } catch (e) { /* CORS */ }

            return null;
        } catch (e) {
            return null;
        }
    }

    /**
     * Standart SCORM API nesnesini (1.2 veya 2004) pencere hiyerarşisinde arar.
     * Maksimum 500 seviye derinliğe kadar tarama yapar.
     * @returns {{ api: object, version: string }|null}
     */
    function findStandardSCORM(win) {
        var attempts = 0;
        var limit = 500;

        while (attempts < limit) {
            // SCORM 2004
            try {
                if (win.API_1484_11) {
                    return { api: win.API_1484_11, version: '2004' };
                }
            } catch (e) { /* CORS */ }

            // SCORM 1.2
            try {
                if (win.API) {
                    return { api: win.API, version: '1.2' };
                }
            } catch (e) { /* CORS */ }

            // Üst pencereye çık
            try {
                if (!win.parent || win.parent === win) break;
                win = win.parent;
            } catch (e) {
                break;
            }

            attempts++;
        }

        return null;
    }

    /**
     * URL parametrelerinden hedef maksimum puanı okur.
     * Tanınan parametreler: max_score, maxScore, max, points, limit
     * Bulunamazsa varsayılan 20 döner.
     */
    function getTargetMax() {
        var targetMax = 20;
        try {
            var urlParams = new URLSearchParams(window.location.search);
            var keys = ['max_score', 'maxScore', 'max', 'points', 'limit'];
            for (var i = 0; i < keys.length; i++) {
                if (urlParams.has(keys[i])) {
                    var val = parseInt(urlParams.get(keys[i]), 10);
                    if (!isNaN(val) && val > 0) {
                        targetMax = val;
                        break;
                    }
                }
            }
        } catch (e) {
            // URL ayrıştırma hatası — varsayılanı kullan
        }
        return targetMax;
    }

    // ─────────────────────────────────────────────
    //  Standart SCORM Yardımcıları
    // ─────────────────────────────────────────────

    function scormSetValue(key2004, key12, value) {
        if (!scormAPI) return false;
        try {
            var res;
            if (activeChannel === 'scorm2004') {
                res = scormAPI.SetValue(key2004, value);
            } else {
                res = scormAPI.LMSSetValue(key12, value);
            }
            return (res === 'true' || res === true);
        } catch (e) {
            log('SetValue hatası: ' + e.message, 'error');
            return false;
        }
    }

    function scormGetValue(key2004, key12) {
        if (!scormAPI) return '';
        try {
            if (activeChannel === 'scorm2004') {
                return scormAPI.GetValue(key2004) || '';
            } else {
                return scormAPI.LMSGetValue(key12) || '';
            }
        } catch (e) {
            log('GetValue hatası: ' + e.message, 'error');
            return '';
        }
    }

    function scormCommit() {
        if (!scormAPI) return false;
        try {
            if (activeChannel === 'scorm2004') {
                scormAPI.Commit('');
            } else {
                scormAPI.LMSCommit('');
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // ─────────────────────────────────────────────
    //  Ana SCORM Nesnesi
    // ─────────────────────────────────────────────

    var SCORM = {

        /**
         * Entegrasyon servisini başlatır.
         * Önce MEBİ kanalını, bulamazsa standart SCORM API'yi arar.
         * @returns {boolean} Başarı durumu
         */
        initialize: function () {
            if (isInitialized) return true;

            startTime = Date.now();

            // 1. Öncelik: MEBİ onCompleted kanalı
            var mebi = findMebiAPI();
            if (mebi) {
                activeChannel = 'mebi';
                isInitialized = true;
                log('MEBİ onCompleted kanalı algılandı. Entegrasyon aktif.', 'success');
                return true;
            }

            // 2. Öncelik: Standart SCORM API
            var result = findStandardSCORM(window);

            // opener penceresinde de ara (bazı LMS'ler popup ile açar)
            if (!result && window.opener) {
                try {
                    result = findStandardSCORM(window.opener);
                } catch (e) { /* CORS */ }
            }

            if (result) {
                scormAPI = result.api;
                activeChannel = result.version === '2004' ? 'scorm2004' : 'scorm12';

                var initRes;
                try {
                    if (activeChannel === 'scorm2004') {
                        initRes = scormAPI.Initialize('');
                    } else {
                        initRes = scormAPI.LMSInitialize('');
                    }
                } catch (e) {
                    log('SCORM Initialize hatası: ' + e.message, 'error');
                    return false;
                }

                isInitialized = (initRes === 'true' || initRes === true);

                if (isInitialized) {
                    scormSetValue('cmi.completion_status', 'cmi.core.lesson_status', 'incomplete');
                    scormSetValue('cmi.score.min', 'cmi.core.score.min', '0');
                    scormCommit();
                    log('Standart SCORM ' + result.version + ' API algılandı. Entegrasyon aktif.', 'success');
                }

                return isInitialized;
            }

            // 3. Hiçbir kanal bulunamadı → Sandbox modu
            activeChannel = null;
            isInitialized = true;
            log('LMS algılanamadı. Sandbox modunda çalışılıyor.', 'warning');
            return true;
        },

        /**
         * Entegrasyon servisini sonlandırır.
         * Standart SCORM modunda Terminate/LMSFinish çağırır.
         * @returns {boolean} Başarı durumu
         */
        terminate: function () {
            if (!isInitialized) return false;

            // Oturum süresini gönder
            if (activeChannel === 'scorm2004' && scormAPI) {
                try {
                    scormSetValue('cmi.session_time', null, getDurationString());
                    scormCommit();
                    scormAPI.Terminate('');
                } catch (e) {
                    log('SCORM Terminate hatası: ' + e.message, 'error');
                }
            } else if (activeChannel === 'scorm12' && scormAPI) {
                try {
                    scormSetValue(null, 'cmi.core.session_time', getDurationString());
                    scormCommit();
                    scormAPI.LMSFinish('');
                } catch (e) {
                    log('SCORM LMSFinish hatası: ' + e.message, 'error');
                }
            }

            isInitialized = false;
            log('Entegrasyon servisi sonlandırıldı. Süre: ' + getDurationString(), 'info');
            return true;
        },

        /**
         * Tamamlama durumunu iletir (Puansız etkinlikler için).
         * @param {boolean} passed - Başarı durumu (varsayılan: true)
         * @returns {boolean}
         */
        complete: function (passed) {
            if (typeof passed === 'undefined') passed = true;
            return this.sendScore(100, 100, passed);
        },

        /**
         * Puan ve tamamlanma durumunu aktif kanala iletir.
         *
         * MEBİ modunda: onCompleted kanalına ölçeklenmiş puan gönderir.
         * Standart SCORM modunda: cmi veri modeline yazar ve commit eder.
         *
         * @param {number} rawScore    - Etkinlikte alınan ham puan
         * @param {number} examMaxScore - Etkinliğin maksimum ham puanı
         * @param {boolean} passed      - Başarı durumu (geçti/kaldı)
         * @returns {boolean}
         */
        sendScore: function (rawScore, examMaxScore, passed) {
            if (typeof rawScore === 'undefined') rawScore = 0;
            if (typeof examMaxScore === 'undefined') examMaxScore = 100;
            if (typeof passed === 'undefined') passed = true;

            if (!isInitialized) this.initialize();

            // Sıfıra bölme ve geçersiz değer güvenliği
            var safeExamMax = examMaxScore > 0 ? examMaxScore : 1;
            var safeRaw = Math.max(0, Math.min(rawScore, safeExamMax));
            var targetMax = getTargetMax();
            var score = Math.round((safeRaw / safeExamMax) * targetMax);
            var scaled = targetMax > 0 ? (score / targetMax) : 1;
            var duration = getDurationString();
            var status = passed ? 'passed' : 'failed';

            log(
                'sendScore → Ham: ' + safeRaw + '/' + safeExamMax +
                ', Hedef: ' + targetMax +
                ', Ölçeklenmiş: ' + score +
                ', Durum: ' + status, 'info'
            );

            // ── Kanal 1: MEBİ onCompleted ──
            if (activeChannel === 'mebi') {
                var mebiWindow = findMebiAPI();
                if (mebiWindow) {
                    var dataToSend = {
                        'score': {
                            'max': targetMax,
                            'min': 0,
                            'raw': score,
                            'scaled': scaled
                        },
                        'completion': true,
                        'success': passed,
                        'duration': duration
                    };

                    try {
                        mebiWindow.onCompleted(dataToSend);
                        log('Puan MEBİ\'ye iletildi: ' + JSON.stringify(dataToSend), 'success');
                        return true;
                    } catch (err) {
                        log('MEBİ onCompleted gönderim hatası: ' + err.message, 'error');
                        return false;
                    }
                }
            }

            // ── Kanal 2: Standart SCORM API ──
            if ((activeChannel === 'scorm2004' || activeChannel === 'scorm12') && scormAPI) {
                try {
                    if (activeChannel === 'scorm2004') {
                        scormSetValue('cmi.score.raw', 'cmi.core.score.raw', String(score));
                        scormSetValue('cmi.score.max', 'cmi.core.score.max', String(targetMax));
                        scormSetValue('cmi.score.min', 'cmi.core.score.min', '0');
                        scormSetValue('cmi.score.scaled', null, String(scaled));
                        scormSetValue('cmi.success_status', null, status);
                        scormSetValue('cmi.completion_status', 'cmi.core.lesson_status', 'completed');
                        scormSetValue('cmi.session_time', null, duration);
                    } else {
                        scormAPI.LMSSetValue('cmi.core.score.raw', String(score));
                        scormAPI.LMSSetValue('cmi.core.score.max', String(targetMax));
                        scormAPI.LMSSetValue('cmi.core.score.min', '0');
                        scormAPI.LMSSetValue('cmi.core.lesson_status', passed ? 'passed' : 'failed');
                        scormAPI.LMSSetValue('cmi.core.session_time', duration);
                    }
                    scormCommit();
                    log('Puan standart SCORM API ile iletildi. Skor: ' + score + '/' + targetMax, 'success');
                    return true;
                } catch (err) {
                    log('Standart SCORM puan gönderim hatası: ' + err.message, 'error');
                    return false;
                }
            }

            // ── Kanal 3: Sandbox (Hiçbir LMS bulunamadı) ──
            log(
                '[Sandbox] Skor simüle edildi: ' + score + '/' + targetMax +
                ' (Ham: ' + safeRaw + '/' + safeExamMax + ', Durum: ' + status + ')',
                'warning'
            );
            return false;
        },

        // ─────────────────────────────────────────
        //  İlerleme Takibi (suspend_data)
        // ─────────────────────────────────────────

        /**
         * Etkinlik ilerlemesini kaydeder.
         * Standart SCORM modunda cmi.suspend_data alanına JSON olarak yazar.
         * MEBİ ve Sandbox modunda yerel bellekte tutar.
         *
         * @param {Object} stateObj - Kaydedilecek ilerleme verisi
         * @returns {boolean} Başarı durumu
         */
        saveProgress: function (stateObj) {
            if (!isInitialized) this.initialize();

            try {
                var json = JSON.stringify(stateObj);

                // Standart SCORM modunda suspend_data'ya yaz
                if ((activeChannel === 'scorm2004' || activeChannel === 'scorm12') && scormAPI) {
                    // SCORM 1.2 suspend_data limiti: 4096 karakter
                    if (activeChannel === 'scorm12' && json.length > 4096) {
                        log('İlerleme verisi 4096 karakter sınırını aşıyor (' + json.length + ' karakter). Kayıt yapılamadı.', 'error');
                        return false;
                    }
                    scormSetValue('cmi.suspend_data', 'cmi.suspend_data', json);
                    scormCommit();
                    log('İlerleme kaydedildi (suspend_data, ' + json.length + ' karakter).', 'info');
                    return true;
                }

                // MEBİ ve Sandbox modunda yerel bellekte tut
                sandboxStore.suspendData = stateObj;
                log('[Sandbox] İlerleme yerel bellekte kaydedildi.', 'info');
                return true;
            } catch (e) {
                log('İlerleme kaydetme hatası: ' + e.message, 'error');
                return false;
            }
        },

        /**
         * Daha önce kaydedilmiş etkinlik ilerlemesini geri yükler.
         * Standart SCORM modunda cmi.suspend_data alanından okur.
         * MEBİ ve Sandbox modunda yerel bellekten döner.
         *
         * @returns {Object|null} Kaydedilmiş ilerleme verisi veya null
         */
        loadProgress: function () {
            if (!isInitialized) this.initialize();

            // Standart SCORM modunda suspend_data'dan oku
            if ((activeChannel === 'scorm2004' || activeChannel === 'scorm12') && scormAPI) {
                try {
                    var raw = scormGetValue('cmi.suspend_data', 'cmi.suspend_data');
                    if (raw && raw.length > 2) {
                        var data = JSON.parse(raw);
                        log('İlerleme geri yüklendi (suspend_data).', 'info');
                        return data;
                    }
                } catch (e) {
                    log('İlerleme yükleme hatası (bozuk veri): ' + e.message, 'error');
                }
                return null;
            }

            // MEBİ ve Sandbox modunda yerel bellekten döndür
            if (sandboxStore.suspendData) {
                log('[Sandbox] İlerleme yerel bellekten yüklendi.', 'info');
                return sandboxStore.suspendData;
            }

            return null;
        },

        // ─────────────────────────────────────────
        //  Adım Takibi (lesson_location)
        // ─────────────────────────────────────────

        /**
         * Öğrencinin mevcut adımını/bölümünü kaydeder.
         * Etkinlik yeniden açıldığında kaldığı yerden devam edebilmesi için kullanılır.
         *
         * @param {string|number} step - Mevcut adım (örn: 'bolum-3', 'soru-5', 2)
         * @returns {boolean}
         */
        setStep: function (step) {
            if (!isInitialized) this.initialize();

            if ((activeChannel === 'scorm2004' || activeChannel === 'scorm12') && scormAPI) {
                scormSetValue('cmi.location', 'cmi.core.lesson_location', String(step));
                scormCommit();
                log('Adım kaydedildi: ' + step, 'info');
                return true;
            }

            sandboxStore.step = String(step);
            log('[Sandbox] Adım kaydedildi: ' + step, 'info');
            return true;
        },

        /**
         * Daha önce kaydedilmiş adımı/bölümü geri yükler.
         *
         * @returns {string|null} Kaydedilmiş adım veya null
         */
        getStep: function () {
            if (!isInitialized) this.initialize();

            if ((activeChannel === 'scorm2004' || activeChannel === 'scorm12') && scormAPI) {
                var val = scormGetValue('cmi.location', 'cmi.core.lesson_location');
                if (val && val.length > 0) {
                    log('Adım geri yüklendi: ' + val, 'info');
                    return val;
                }
                return null;
            }

            if (sandboxStore.step) {
                log('[Sandbox] Adım geri yüklendi: ' + sandboxStore.step, 'info');
                return sandboxStore.step;
            }

            return null;
        },

        // ─────────────────────────────────────────
        //  Durum ve Bilgi
        // ─────────────────────────────────────────

        /**
         * Durum bilgisini doğrudan ayarlar (Standart SCORM uyumluluğu).
         * MEBİ modunda bir etkisi yoktur.
         * @param {string} status - 'completed', 'incomplete', 'passed', 'failed'
         * @returns {boolean}
         */
        setStatus: function (status) {
            if (!isInitialized) this.initialize();

            if (activeChannel === 'scorm2004' || activeChannel === 'scorm12') {
                var cStatus = (status === 'complete' || status === 'completed') ? 'completed' : status;
                scormSetValue('cmi.completion_status', 'cmi.core.lesson_status', cStatus);
                scormCommit();
                log('Durum güncellendi: ' + cStatus, 'info');
                return true;
            }

            log('setStatus → MEBİ modunda yalnızca sendScore ile durum iletilebilir.', 'info');
            return false;
        },

        /**
         * Aktif kanalı, başlatılma durumunu ve oturum süresini döndürür.
         * @returns {{ channel: string|null, initialized: boolean, elapsed: string }}
         */
        getInfo: function () {
            return {
                channel: activeChannel,
                initialized: isInitialized,
                elapsed: getDurationString()
            };
        }
    };

    // Global nesne olarak dışarı aktar
    window.SCORM = SCORM;

})(window);
