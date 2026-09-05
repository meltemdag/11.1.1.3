# SCORM Bütünleşik Entegrasyon Rehberi (v3.0)

Bu belgede, Tarih dersi etkileşimli etkinliklerine (eşleştirme, sıralama, çoktan seçmeli, sürükle-bırak vb.) kütüphanesiz SCORM entegrasyonunun nasıl gerçekleştirildiği, çevrimdışı test modunun nasıl kullanılacağı ve MEBİ için SCORM paketinin nasıl hazırlanacağı açıklanmıştır.

> [!IMPORTANT]
> **Önemli Geliştirici Notları:**
> 1. SCORM entegrasyonuyla ilgili tüm dosyalar (kod güncellemeleri, sarmalayıcı JavaScript modülü ve manifest şablonu) yapay zeka (AI) tarafından otomatik olarak oluşturulacaktır. Kullanıcının el ile (manuel) herhangi bir kodlama veya dosya düzenleme işlemi yapmasına gerek yoktur. Kullanıcının tek sorumluluğu, yapay zekanın hazırladığı dosyaları paketleme adımlarında belirtildiği gibi sıkıştırıp `.zip` haline getirmektir.
> 2. **Konsol Logu Yasağı:** Entegrasyon esnasında, etkinlik dosyalarında veya SCORM tetikleyicilerinde tarayıcı konsoluna kesinlikle hiçbir SCORM logu (`console.log`, `console.info`, `console.warn` vb.) eklenmemelidir. Entegrasyon tamamen sessiz ve temiz kod prensibiyle yürütülmelidir.

---

## 🏗️ Mimari: Öncelik Sıralı Kanal Algılama

Bütünleşik wrapper, platforma göre otomatik kanal seçimi yapar:

| Öncelik | Kanal | Platform | Algılama Yöntemi |
|---------|-------|----------|------------------|
| 1️⃣ | MEBİ `onCompleted` | MEBİ / e-Yaygın / EBA | `frmApp-0` iframe → `window` → `parent` → `top` |
| 2️⃣ | Standart SCORM 2004 | Moodle, Canvas, vb. | `window.API_1484_11` (500 seviye derinlik) |
| 3️⃣ | Standart SCORM 1.2 | Eski LMS'ler | `window.API` (500 seviye derinlik) |
| 4️⃣ | Sandbox Modu | LMS yok (yerel test) | Otomatik — renkli konsol logları |

---

## 🛠️ Yapılan Değişiklikler ve Eklenen Dosyalar

### 1. [scorm-api-wrapper.js] (Bütünleşik Modül v3.0)
Saf JavaScript ile yazılmış, hem **MEBİ** hem **standart SCORM** desteği sunan hafif sarmalayıcı dosya:

* **MEBİ Öncelikli:** MEBİ'in iframe penceresine (`frmApp-0`) enjekte ettiği `onCompleted` metodunu ilk olarak arar ve puan gönderiminde birinci öncelik olarak kullanır.
* **Standart SCORM Desteği:** MEBİ kanalı bulunamazsa standart SCORM 1.2 veya 2004 API'sini (`LMSInitialize`, `SetValue`, `Commit` vb.) kullanarak evrensel LMS uyumu sağlar.
* **Dinamik Ölçekleme:** URL parametrelerini tarayarak (`max_score`, `maxScore`, `max`, `points` veya `limit`) hedef maksimum puanı otomatik olarak tespit eder. Parametre bulunamazsa varsayılan **20** puanı temel alır.
* **Dinamik Süre Takibi:** `initialize()` çağrısından itibaren geçen süreyi ISO 8601 formatında (`PT1H5M32S`) hesaplar ve gönderime dahil eder.
* **Dinamik Başarı Raporlama:** Öğrencinin geçti/kaldı (`passed: true/false`) durumunu ilgili kanala iletir.
* **İlerleme Kaydetme ve Geri Yükleme:** `saveProgress()` ile etkinlik durumunu (hangi sorular yanıtlandı, hangi eşleştirmeler yapıldı vb.) JSON olarak kaydeder. `loadProgress()` ile geri yükler. Standart SCORM modunda `cmi.suspend_data` alanını kullanır, MEBİ ve Sandbox modunda yerel bellekte tutar.
* **Adım Takibi:** `setStep()` ile öğrencinin mevcut bölümünü/adımını kaydeder. `getStep()` ile geri yükler. Etkinlik yeniden açıldığında öğrenci kaldığı yerden devam edebilir.
* **Sessiz Çalışma Modu:** LMS ortamı tespit edildiğinde hata dışındaki tüm konsol loglarını gizler.
* **Sandbox Modu:** LMS bulunamadığında renkli konsol loglarıyla çevrimdışı test imkânı sunar.

### 2. [index.html]
* **API Bağlantısı:** Sayfa yüklendiğinde `window.SCORM.initialize()`, kapatılırken `window.SCORM.terminate()` çağrılır.
* **Akış Entegrasyonu:** Etkinlik tamamlandığında (örneğin öğrenci tüm soruları yanıtladığında, eşleştirmeyi tamamladığında veya sıralamayı bitirdiğinde) `window.SCORM.sendScore(rawScore, maxScore, passed)` fonksiyonu tetiklenir. Ölçekleme ve kanal seçimi wrapper tarafından otomatik gerçekleştirilir.

---

## 📋 API Referansı

### Temel Fonksiyonlar

| Fonksiyon | Açıklama | Örnek Kullanım |
|-----------|----------|----------------|
| `SCORM.initialize()` | Servisi başlatır, kanalı algılar, süre sayacını başlatır | `window.SCORM.initialize()` |
| `SCORM.terminate()` | Servisi sonlandırır, SCORM modunda `Finish` çağırır | `window.SCORM.terminate()` |
| `SCORM.sendScore(ham, maks, geçti)` | Puan ve durumu aktif kanala iletir | `SCORM.sendScore(8, 10, true)` |
| `SCORM.complete(geçti)` | Puansız etkinliklerde tamamlama durumu gönderir | `SCORM.complete(true)` |

### İlerleme Takibi

| Fonksiyon | Açıklama | Örnek Kullanım |
|-----------|----------|----------------|
| `SCORM.saveProgress(veri)` | Etkinlik ilerlemesini JSON olarak kaydeder | `SCORM.saveProgress({soru: 3, puan: 5})` |
| `SCORM.loadProgress()` | Kaydedilmiş ilerleme verisini geri yükler | `var veri = SCORM.loadProgress()` |
| `SCORM.setStep(adım)` | Mevcut adımı/bölümü kaydeder | `SCORM.setStep('bolum-2')` |
| `SCORM.getStep()` | Kaydedilmiş adımı geri yükler | `var adim = SCORM.getStep()` |

### Durum ve Bilgi

| Fonksiyon | Açıklama | Örnek Kullanım |
|-----------|----------|----------------|
| `SCORM.setStatus(durum)` | Standart SCORM modunda durum ayarlar | `SCORM.setStatus('completed')` |
| `SCORM.getInfo()` | Aktif kanal, başlatılma durumu ve geçen süreyi döndürür | `SCORM.getInfo()` |

---

## 🖥️ Sandbox Modu ve Tarayıcı Konsolu Testi

Sayfayı doğrudan bir LMS olmadan yerel tarayıcıda açtığınızda **Sandbox Modu** otomatik olarak devreye girer.

Bu modda tarayıcının geliştirici araçlarını (F12 -> Console sekmesi) açarak test edebilirsiniz:
1. Sayfa yüklendiğinde SCORM bağlantı simülasyonu başlatılır ve konsola bilgi logları düşer.
2. Etkinlik tamamlandığında (örneğin tüm eşleştirmeler yapıldığında, sıralama kontrol edildiğinde veya sorular yanıtlandığında) LMS'ye iletilen puanlar (hedef ölçeğe göre dinamik oranlanmış), `passed`/`failed` durumları renkli konsol logları olarak anında listelenir. Örneğin `?max_score=30` parametresi ile açılırsa puanlar 30 üzerinden hesaplanıp loglanır.
3. `saveProgress()` ve `loadProgress()` fonksiyonları Sandbox modunda yerel bellekte çalışır; sayfa yenilenene kadar veriler korunur.

---

> [!TIP]
> **Entegrasyon Akışı Hakkında Önemli Not:**
> Her etkinliğin akışı farklıdır; bazılarında herhangi bir gönderim butonu bulunmayabilir (örneğin süre bittiğinde otomatik gönderim yapılabilir, tüm eşleştirmeler tamamlandığında tetiklenebilir, sıralama kontrol edildiğinde veya son bölüme ulaşıldığında otomatik gönderilebilir). Bu nedenle, gelecekte bir yapay zekaya veya geliştiriciye SCORM entegrasyonu görevi verildiğinde, varsayımlarda bulunmak yerine şu soruyu sorarak netleştirmesi önerilir:
> *"Puan ve durum gönderimini hangi eylem (örneğin hangi butona basıldığında veya hangi olay/event gerçekleştiğinde) tetiklemeli?"*

---

## 📦 MEBİ (SCORM 1.2) Paketi Hazırlama Kılavuzu

### 📄 imsmanifest.xml Şablonu
Projenizin kök dizininde **`imsmanifest.xml`** dosyası oluşturulmalıdır. Dosya içeriği şu şekildedir:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest identifier="com.mebi.tarih.etkinlik" version="1.2"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="mebi_tarih_org">
    <organization identifier="mebi_tarih_org">
      <title>Tarih Dersi Etkileşimli Etkinlik</title>
      <item identifier="item_tarih_etkinlik" identifierref="resource_tarih_etkinlik">
        <title>Tarih Etkinliği</title>
        <adlcp:masteryscore>50</adlcp:masteryscore> <!-- %50 baraj puanı -->
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_tarih_etkinlik" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
      <file href="scorm-api-wrapper.js"/>
    </resource>
  </resources>
</manifest>
```

### 🗜️ Paketleme Adımları:
1. `index.html`, `scorm-api-wrapper.js` ve oluşturduğunuz `imsmanifest.xml` dosyalarını seçin.
2. Sağ tıklayıp sıkıştırarak bir **`.zip`** arşivi oluşturun (Klasörü değil, **dosyaları seçip direkt sıkıştırın**, `imsmanifest.xml` zipin en üstünde olmalıdır).
3. Bu `.zip` dosyasını MEBİ / e-Yaygın sistemine yükleyin. Entegrasyon tamamen hazırdır!

> [!CAUTION]
> **Kesin Kural:** Entegrasyon esnasında ve etkinlik betiklerinde konsola hiçbir SCORM logu (`console.log` vb.) eklenmemelidir.
