import React, { useState } from 'react';
import { TreatyProgress } from '../types';
import { 
  CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatyComparisonProps {
  progress: TreatyProgress;
  onReset?: () => void;
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
    badge: 'Batı Üstünlüğü & Lale Devri',
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

export const TreatyComparison: React.FC<TreatyComparisonProps> = () => {
  const [finished, setFinished] = useState<boolean>(false);

  const handleFinish = () => {
    setFinished(true);
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });

    try {
      const win = window as any;
      if (win.SCORM_API_WRAPPER && typeof win.SCORM_API_WRAPPER.setCompleted === 'function') {
        win.SCORM_API_WRAPPER.setCompleted();
      } else if (win.pipwerks && win.pipwerks.SCORM) {
        win.pipwerks.SCORM.set("cmi.core.lesson_status", "completed");
        win.pipwerks.SCORM.save();
      }
    } catch {
      // Sessiz hata yönetimi
    }
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
              XVII-XVIII. Yüzyıl Osmanlı Diplomasisi analizini, neden-sonuç sınıflandırmalarını ve antlaşma kronolojisini eksiksiz tamamladınız.
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
              cardBg: 'bg-[#f1e3df]/80 border-[#cfa096]',
              yearBadge: 'bg-parchment-50 text-seal-dark border-[#cfa096]',
              headerBorder: 'border-[#cfa096]/60',
              itemBg: 'bg-parchment-50/90 border-[#dcc0b8]'
            },
            prut: {
              cardBg: 'bg-[#f1e7cc]/80 border-[#cdb37a]',
              yearBadge: 'bg-parchment-50 text-parchment-800 border-[#cdb37a]',
              headerBorder: 'border-[#cdb37a]/60',
              itemBg: 'bg-parchment-50/90 border-[#ddcfa4]'
            },
            pasarofca: {
              cardBg: 'bg-[#e5e5ee]/80 border-[#a9aecb]',
              yearBadge: 'bg-parchment-50 text-[#3b3f63] border-[#a9aecb]',
              headerBorder: 'border-[#a9aecb]/60',
              itemBg: 'bg-parchment-50/90 border-[#c4c6d8]'
            },
            belgrad: {
              cardBg: 'bg-[#eaeddb]/80 border-[#b3bd8e]',
              yearBadge: 'bg-parchment-50 text-[#3c4a1d] border-[#b3bd8e]',
              headerBorder: 'border-[#b3bd8e]/60',
              itemBg: 'bg-parchment-50/90 border-[#ccd3ab]'
            },
            kucuk_kaynarca: {
              cardBg: 'bg-[#f0dedb]/80 border-[#c9948d]',
              yearBadge: 'bg-parchment-50 text-[#5f1414] border-[#c9948d]',
              headerBorder: 'border-[#c9948d]/60',
              itemBg: 'bg-parchment-50/90 border-[#dcb8b2]'
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
              className={`${theme.cardBg} rounded-2xl border-2 p-4 shadow-parchment flex flex-col justify-between space-y-3.5 hover:shadow-parchment-lg transition-all`}
            >
              {/* Kart Başlığı */}
              <div className={`border-b ${theme.headerBorder} pb-3 space-y-1.5`}>
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
              <div className="space-y-2 text-xs grow">
                {/* Dış Politika Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-ink-light leading-relaxed">
                    {item.foreignPolicy.summary}
                  </p>
                </div>

                {/* Karadeniz Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-ink-light leading-relaxed">
                    {item.blackSea.summary}
                  </p>
                </div>

                {/* Diplomasi & Arabuluculuk Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-ink-light leading-relaxed">
                    {item.diplomacy.summary}
                  </p>
                </div>

                {/* İlkler & Kırılmalar Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-ink-light leading-relaxed">
                    {item.breakthroughs.summary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Eylem ve Tamamlama Paneli */}
      <div className="parchment-surface rounded-xl border-2 border-parchment-400/70 p-4 sm:p-5 shadow-parchment flex items-center justify-end">
        <button
          onClick={handleFinish}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-seal-light to-seal hover:from-seal hover:to-seal-dark text-parchment-100 rounded-xl text-xs sm:text-sm font-bold shadow-wax transition-all cursor-pointer border border-brass/50"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Etkinliği Bitir</span>
        </button>
      </div>
    </div>
  );
};
