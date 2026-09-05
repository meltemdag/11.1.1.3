import React, { useState } from 'react';
import { TreatyProgress } from '../types';
import { 
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatyComparisonProps {
  progress: TreatyProgress;
  onReset?: () => void;
  onRestart?: () => void;
  onGoToPrevTab?: () => void;
}

interface ComparisonData {
  treatyId: string;
  title: string;
  year: number;
  badge: string;
  badgeColor: string;
  foreignPolicy: {
    tag: string;
    summary: string;
  };
  blackSea: {
    tag: string;
    summary: string;
  };
  diplomacy: {
    tag: string;
    summary: string;
  };
  breakthroughs: {
    tag: string;
    summary: string;
  };
}

const COMPARISON_DATA: ComparisonData[] = [
  {
    treatyId: 'karlofca',
    title: 'Karlofça Antlaşması',
    year: 1699,
    badge: 'Savunmaya Geçiş',
    badgeColor: 'bg-[#f0dcd8] text-seal-dark border-[#cfa096]',
    foreignPolicy: {
      tag: 'Savunma Politikası',
      summary: 'Taarruz dönemi kapandı; sınırları koruma politikasına geçildi.'
    },
    blackSea: {
      tag: 'Kuzey Tehdidi',
      summary: 'Azak Kalesi bırakıldı; Karadeniz ilk kez kuzeyden tehdit aldı.'
    },
    diplomacy: {
      tag: 'Yabancı Arabuluculuk',
      summary: 'İngiltere-Hollanda arabulucu oldu; garantörlük Avusturya’ya verildi.'
    },
    breakthroughs: {
      tag: 'Batıda İlk Büyük Kayıp',
      summary: 'Geniş topraklar kaybedildi; Orta Avrupa üstünlüğü sona erdi.'
    }
  },
  {
    treatyId: 'prut',
    title: 'Prut Antlaşması',
    year: 1711,
    badge: 'Kayıpları Telafi Umudu',
    badgeColor: 'bg-[#f2e7c9] text-parchment-800 border-[#cdb37a]',
    foreignPolicy: {
      tag: 'Kayıpları Telafi',
      summary: 'Kaybedilen yerleri geri alma inancı ve cesareti güçlendi.'
    },
    blackSea: {
      tag: 'Kuzey Güvenliği',
      summary: 'Azak Kalesi geri alındı; Rusya Karadeniz’den uzaklaştırıldı.'
    },
    diplomacy: {
      tag: 'Doğrudan Zafer',
      summary: 'Çar I. Petro barış istedi; İstanbul’daki Rus elçiliği kapatıldı.'
    },
    breakthroughs: {
      tag: 'İlk Başarılı Telafi',
      summary: 'Karlofça sonrası ilk askeri ve diplomatik kazanç sağlandı.'
    }
  },
  {
    treatyId: 'pasarofca',
    title: 'Pasarofça Antlaşması',
    year: 1718,
    badge: 'Batı Üstünlüğü ve Lale Devri',
    badgeColor: 'bg-[#e2e2ec] text-[#3b3f63] border-[#a9aecb]',
    foreignPolicy: {
      tag: 'Barış ve Islahat',
      summary: 'Geri alma ümidi bitti; barış ve Batı tarzı ıslahatlar başladı.'
    },
    blackSea: {
      tag: 'Tuna Hattı Kaybı',
      summary: 'Belgrad ve Banat kaybedildi; Mora Yarımadası korundu.'
    },
    diplomacy: {
      tag: 'Sürekli Diplomasi',
      summary: 'İngiltere-Hollanda arabulucu oldu; Avrupa’ya ilk elçiler gitti.'
    },
    breakthroughs: {
      tag: 'Batı Üstünlüğünün Kabulü',
      summary: 'Avrupa’nın askeri üstünlüğü kabul edildi; Lale Devri başladı.'
    }
  },
  {
    treatyId: 'belgrad',
    title: 'Belgrad Antlaşması',
    year: 1739,
    badge: 'Son Kazançlı Antlaşma',
    badgeColor: 'bg-[#e9edda] text-[#3c4a1d] border-[#b3bd8e]',
    foreignPolicy: {
      tag: 'Askeri Islahat Başarısı',
      summary: 'Askeri ıslahatlar sayesinde iki cepheli savaş kazanıldı.'
    },
    blackSea: {
      tag: 'Türk Gölü Statüsü Korundu',
      summary: 'Rus gemileri yasaklandı; Karadeniz son kez Türk gölü kaldı.'
    },
    diplomacy: {
      tag: 'Fransız Arabuluculuğu',
      summary: 'Fransız desteği karşılığı kapitülasyonlar süresiz yapıldı.'
    },
    breakthroughs: {
      tag: 'Son Stratejik Kazanç',
      summary: 'Belgrad geri alındı; Batı’da 50 yıllık uzun barış başladı.'
    }
  },
  {
    treatyId: 'kucuk_kaynarca',
    title: 'Küçük Kaynarca Antlaşması',
    year: 1774,
    badge: 'En Ağır Kırılma Noktası',
    badgeColor: 'bg-[#efd9d6] text-[#5f1414] border-[#c9948d]',
    foreignPolicy: {
      tag: 'Varlık Mücadelesi',
      summary: 'Uzun rehavet sonucu tarihin en ağır yenilgilerinden biri alındı.'
    },
    blackSea: {
      tag: 'Türk Gölü Statüsü Bitti',
      summary: 'Kırım kaybedildi; Rus gemilerine Boğazlardan serbest geçiş verildi.'
    },
    diplomacy: {
      tag: 'Ağır Tavizler',
      summary: 'Rusya ilk kez kapitülasyon ve Ortodoksları koruma hakkı aldı.'
    },
    breakthroughs: {
      tag: 'İlk Müslüman Toprak Kaybı',
      summary: 'Kırım kaybedildi; ilk kez savaş tazminatı ve halifelik eklendi.'
    }
  }
];

export const TreatyComparison: React.FC<TreatyComparisonProps> = ({
  onReset,
  onRestart
}) => {
  const [finished, setFinished] = useState<boolean>(false);
  const [isTerminated, setIsTerminated] = useState<boolean>(false);

  const notifyScormCompleted = () => {
    try {
      const win = window as any;
      if (win.SCORM_API_WRAPPER && typeof win.SCORM_API_WRAPPER.setCompleted === 'function') {
        win.SCORM_API_WRAPPER.setCompleted();
      } else if (win.pipwerks && win.pipwerks.SCORM) {
        win.pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
        win.pipwerks.SCORM.save();
      }
    } catch {
      // Sessiz hata yönetimi (konsola log eklenmez)
    }
  };

  const handleFinish = () => {
    setFinished(true);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });
    notifyScormCompleted();
    try {
      window.close();
    } catch {
      // sessiz
    }
    setIsTerminated(true);
  };

  const handleRestart = () => {
    notifyScormCompleted();
    (onRestart || onReset)?.();
  };

  return (
    <div className="space-y-4">
      {/* Açıklama ve Yönlendirme Metni */}
      <div className="parchment-surface rounded-xl border-2 border-parchment-400/70 p-3.5 sm:p-4 text-xs sm:text-sm text-ink-light shadow-parchment flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p>
          XVII-XVIII. yüzyıl boyunca imzalanan antlaşmaları dış politika, Karadeniz hakimiyeti, diplomasi ve dönüm noktaları üzerinden karşılaştırınız.
        </p>
      </div>

      {finished && (
        <div className="bg-[#eef0da] border-2 border-olive-seal/50 rounded-xl p-4 sm:p-5 flex items-center gap-3 text-[#2f3a10] shadow-parchment animate-fade-in">
          <div className="w-9 h-9 rounded-full bg-olive-seal text-parchment-100 flex items-center justify-center shrink-0 shadow-wax">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-antique font-bold text-sm sm:text-base">Etkinlik Başarıyla Tamamlandı</h4>
            <p className="text-xs sm:text-sm text-[#4a5423] mt-0.5">
              XVII-XVIII. Yüzyıl Osmanlı Diplomasisi analizini, neden-sonuç sınıflandırmalarını ve diplomasi zincirini eksiksiz tamamladınız.
            </p>
          </div>
        </div>
      )}

      {/* 5 Antlaşmalı Karşılaştırma Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
        {COMPARISON_DATA.map((item) => {
          const themes: Record<string, {
            cardBg: string;
            yearBadge: string;
            headerBorder: string;
            itemBg: string;
          }> = {
            karlofca: {
              cardBg: 'bg-[#ecdcd7] border-[#c49287]',
              yearBadge: 'bg-parchment-50 text-seal-dark border-[#c49287]',
              headerBorder: 'border-[#c49287]/60',
              itemBg: 'bg-[#fbf7f6] border-[#dcbbb4]'
            },
            prut: {
              cardBg: 'bg-[#eee1be] border-[#c4a665]',
              yearBadge: 'bg-parchment-50 text-parchment-800 border-[#c4a665]',
              headerBorder: 'border-[#c4a665]/60',
              itemBg: 'bg-[#fcfaf4] border-[#d8c593]'
            },
            pasarofca: {
              cardBg: 'bg-[#dddde8] border-[#9ba1c2]',
              yearBadge: 'bg-parchment-50 text-[#323657] border-[#9ba1c2]',
              headerBorder: 'border-[#9ba1c2]/60',
              itemBg: 'bg-[#f8f8fb] border-[#bec2d6]'
            },
            belgrad: {
              cardBg: 'bg-[#e2e7ce] border-[#a5b279]',
              yearBadge: 'bg-parchment-50 text-[#2f3d13] border-[#a5b279]',
              headerBorder: 'border-[#a5b279]/60',
              itemBg: 'bg-[#fafbf6] border-[#c4cc9f]'
            },
            kucuk_kaynarca: {
              cardBg: 'bg-[#ebd1cd] border-[#ba7f77]',
              yearBadge: 'bg-parchment-50 text-[#540f0f] border-[#ba7f77]',
              headerBorder: 'border-[#ba7f77]/60',
              itemBg: 'bg-[#fbf5f4] border-[#d6a9a3]'
            }
          };

          const theme = themes[item.treatyId] || {
            cardBg: 'parchment-surface border-parchment-400',
            yearBadge: 'bg-parchment-50 text-ink border-parchment-400',
            headerBorder: 'border-parchment-300',
            itemBg: 'parchment-deep border-parchment-300'
          };

          return (
            <div
              key={item.treatyId}
              className={`${theme.cardBg} rounded-2xl border-2 p-4 shadow-parchment flex flex-col justify-between space-y-3 hover:shadow-parchment-lg transition-all`}
            >
              {/* Kart Başlığı */}
              <div className={`border-b ${theme.headerBorder} pb-2.5 space-y-1.5`}>
                <div>
                  <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded border shadow-2xs ${theme.yearBadge}`}>
                    {item.year}
                  </span>
                </div>
                <h3 className="font-antique text-sm font-bold text-ink leading-tight">
                  {item.title}
                </h3>
                <div className={`text-[10.5px] font-semibold px-2 py-0.5 rounded border inline-block ${item.badgeColor}`}>
                  {item.badge}
                </div>
              </div>

              {/* Karşılaştırma Maddeleri */}
              <div className="space-y-2.5 text-xs grow">
                {/* Dış Politika Boyutu */}
                <div className={`rounded-xl py-2.5 px-3 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[12px] text-ink-light leading-relaxed">
                    {item.foreignPolicy.summary}
                  </p>
                </div>

                {/* Karadeniz Boyutu */}
                <div className={`rounded-xl py-2.5 px-3 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[12px] text-ink-light leading-relaxed">
                    {item.blackSea.summary}
                  </p>
                </div>

                {/* Diplomasi ve Arabuluculuk Boyutu */}
                <div className={`rounded-xl py-2.5 px-3 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[12px] text-ink-light leading-relaxed">
                    {item.diplomacy.summary}
                  </p>
                </div>

                {/* İlkler ve Kırılmalar Boyutu */}
                <div className={`rounded-xl py-2.5 px-3 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[12px] text-ink-light leading-relaxed">
                    {item.breakthroughs.summary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Eylem ve Tamamlama Paneli */}
      <div className="parchment-surface rounded-xl border-2 border-parchment-400/70 p-4 sm:p-5 shadow-parchment flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          onClick={handleRestart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-parchment-200 to-parchment-300 hover:from-parchment-300 hover:to-parchment-400 text-ink rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer border border-brass/50"
        >
          <RotateCcw className="w-4 h-4 text-brass-dark" />
          <span>Etkinliği Yeniden Başlat</span>
        </button>

        <button
          onClick={handleFinish}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-b from-seal-light to-seal hover:from-seal hover:to-seal-dark text-parchment-100 rounded-xl text-xs sm:text-sm font-bold shadow-wax transition-all cursor-pointer border border-brass/50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Etkinliği Bitir</span>
        </button>
      </div>

      {/* Etkinliği Bitir Kapanış Ekranı */}
      {isTerminated && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full parchment-surface rounded-2xl border-2 border-brass p-6 sm:p-8 text-center space-y-4 shadow-parchment-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-olive-seal/15 border-2 border-olive-seal text-olive-seal mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-antique text-xl font-bold text-ink">Etkinlik Tamamlandı</h3>
            <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
              1699-1774 Osmanlı Diplomasisi ve Antlaşmalar çalışmasını başarıyla bitirdiniz. Pencereyi veya tarayıcı sekmesini güvenle kapatabilirsiniz.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  try { window.close(); } catch { /* sessiz */ }
                }}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-ink hover:bg-ink-light text-parchment-100 border border-brass/50 transition-all cursor-pointer shadow-wax"
              >
                Pencereyi Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
