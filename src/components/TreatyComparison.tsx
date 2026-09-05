import React, { useState } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyProgress } from '../types';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatyComparisonProps {
  progress: TreatyProgress;
  onReset: () => void;
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
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
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
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
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
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
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
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
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
    badgeColor: 'bg-red-100 text-red-950 border-red-300',
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

export const TreatyComparison: React.FC<TreatyComparisonProps> = ({ progress, onReset, onGoToPrevTab }) => {
  const [finished, setFinished] = useState<boolean>(false);

  const completedTreatiesCount = TREATIES.filter(t => progress[t.id]?.completed).length;

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

  const handleRestart = () => {
    onReset();
    setFinished(false);
    try {
      const win = window as any;
      if (win.SCORM_API_WRAPPER && typeof win.SCORM_API_WRAPPER.setCompleted === 'function') {
        win.SCORM_API_WRAPPER.setCompleted();
      }
    } catch {
      // Sessiz hata yönetimi
    }
  };

  return (
    <div className="space-y-4">
      {/* Açıklama ve Yönlendirme Metni */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p>
          17-18. yüzyıl boyunca imzalanan antlaşmaları dış politika, Karadeniz hakimiyeti, diplomasi ve dönüm noktaları üzerinden karşılaştırınız.
        </p>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0 border border-slate-200">
          {completedTreatiesCount} / {TREATIES.length} Tamamlandı
        </span>
      </div>

      {finished && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 sm:p-5 flex items-center gap-3 text-emerald-950 shadow-sm animate-fade-in">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">Etkinlik Başarıyla Tamamlandı</h4>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              17-18. Yüzyıl Osmanlı Diplomasisi analizini, neden-sonuç sınıflandırmalarını ve antlaşma kronolojisini eksiksiz tamamladınız.
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
              cardBg: 'bg-rose-50/70 border-rose-200/90',
              yearBadge: 'bg-white text-rose-950 border-rose-200',
              headerBorder: 'border-rose-200/70',
              itemBg: 'bg-white/90 border-rose-100/90'
            },
            prut: {
              cardBg: 'bg-amber-50/75 border-amber-200/90',
              yearBadge: 'bg-white text-amber-950 border-amber-200',
              headerBorder: 'border-amber-200/70',
              itemBg: 'bg-white/90 border-amber-100/90'
            },
            pasarofca: {
              cardBg: 'bg-indigo-50/70 border-indigo-200/90',
              yearBadge: 'bg-white text-indigo-950 border-indigo-200',
              headerBorder: 'border-indigo-200/70',
              itemBg: 'bg-white/90 border-indigo-100/90'
            },
            belgrad: {
              cardBg: 'bg-emerald-50/70 border-emerald-200/90',
              yearBadge: 'bg-white text-emerald-950 border-emerald-200',
              headerBorder: 'border-emerald-200/70',
              itemBg: 'bg-white/90 border-emerald-100/90'
            },
            kucuk_kaynarca: {
              cardBg: 'bg-red-50/70 border-red-200/90',
              yearBadge: 'bg-white text-red-950 border-red-200',
              headerBorder: 'border-red-200/70',
              itemBg: 'bg-white/90 border-red-100/90'
            }
          };

          const theme = themes[item.treatyId] || {
            cardBg: 'bg-white border-slate-200',
            yearBadge: 'bg-white text-slate-900 border-slate-200',
            headerBorder: 'border-slate-100',
            itemBg: 'bg-slate-50 border-slate-100'
          };

          return (
            <div
              key={item.treatyId}
              className={`${theme.cardBg} rounded-2xl border p-4 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-sm transition-all`}
            >
              {/* Kart Başlığı */}
              <div className={`border-b ${theme.headerBorder} pb-3 space-y-1.5`}>
                <div>
                  <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded border shadow-2xs ${theme.yearBadge}`}>
                    {item.year}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
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
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {item.foreignPolicy.summary}
                  </p>
                </div>

                {/* Karadeniz Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {item.blackSea.summary}
                  </p>
                </div>

                {/* Diplomasi & Arabuluculuk Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {item.diplomacy.summary}
                  </p>
                </div>

                {/* İlkler & Kırılmalar Boyutu */}
                <div className={`rounded-xl p-2.5 ${theme.itemBg} border shadow-2xs`}>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {item.breakthroughs.summary}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alt Eylem ve Tamamlama Paneli */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onGoToPrevTab && (
            <button
              onClick={onGoToPrevTab}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Antlaşma Kronolojisine Dön</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Etkinliği Baştan Başlat</span>
          </button>
        </div>

        <button
          onClick={handleFinish}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Etkinliği Bitir</span>
        </button>
      </div>
    </div>
  );
};
