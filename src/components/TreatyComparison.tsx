import React, { useState } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyProgress } from '../types';
import { 
  CheckCircle2, 
  RotateCcw, 
  ArrowLeft,
  Columns3,
  Waves,
  ShieldAlert,
  Scroll,
  Award,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatyComparisonProps {
  progress: TreatyProgress;
  onReset: () => void;
  onGoToPrevTab?: () => void;
}

type ComparisonDimension = 'all' | 'foreign_policy' | 'black_sea' | 'diplomacy' | 'breakthroughs';

interface DimensionInfo {
  id: ComparisonDimension;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const DIMENSIONS: DimensionInfo[] = [
  {
    id: 'all',
    label: 'Tüm Kriterleri Karşılaştır (Özet Matris)',
    shortLabel: 'Genel Matris',
    icon: Columns3,
    description: '5 antlaşmanın dış politika, Karadeniz hakimiyeti, diplomasi ve dönüm noktalarını tek tabloda kıyaslayınız.'
  },
  {
    id: 'foreign_policy',
    label: 'Dış Politika & Askeri Strateji',
    shortLabel: 'Dış Politika',
    icon: ShieldAlert,
    description: 'Osmanlı dış politikasının savunmadan telafiye, barıştan varlık mücadelesine evrilmesi.'
  },
  {
    id: 'black_sea',
    label: 'Karadeniz & Boğazlar Hakimiyeti',
    shortLabel: 'Karadeniz Statüsü',
    icon: Waves,
    description: 'Karadeniz’in Türk gölü statüsünün tehdit edilmesi, korunması ve kaybedilme süreci.'
  },
  {
    id: 'diplomacy',
    label: 'Diplomasi, Arabuluculuk & Garantörlük',
    shortLabel: 'Diplomasi & Arabulucu',
    icon: Scroll,
    description: 'Masa başı müzakereleri, arabulucu Avrupalı devletler ve kapitülasyon dengeleri.'
  },
  {
    id: 'breakthroughs',
    label: 'Tarihsel İlkler & Kırılma Noktaları',
    shortLabel: 'İlkler & Kırılmalar',
    icon: Award,
    description: 'Osmanlı siyasi tarihinde ilk kez yaşanan köklü askeri ve diplomatik değişimler.'
  }
];

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
  const [selectedDimension, setSelectedDimension] = useState<ComparisonDimension>('all');
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

  const currentDimInfo = DIMENSIONS.find(d => d.id === selectedDimension) || DIMENSIONS[0];

  return (
    <div className="space-y-4">
      {/* Üst Başlık & Tamamlanma Durumu */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold tracking-wider text-amber-300 bg-amber-950/70 border border-amber-400/30 px-2.5 py-0.5 rounded">
              KARŞILAŞTIRMALI ANALİZ MATRİSİ
            </span>
            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
              5 Antlaşmanın Tematik Kıyaslaması (1699 - 1774)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Osmanlı Devleti’nin 18. yüzyıl boyunca imzaladığı 5 temel antlaşmayı dış politika, Karadeniz hakimiyeti, diplomasi ve dönüm noktaları üzerinden tek bakışta karşılaştırınız.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 rounded-xl shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">İncelenen Duraklar</div>
              <div className="text-base font-bold text-amber-300">
                {completedTreatiesCount} / {TREATIES.length} Tamamlandı
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-extrabold text-sm shadow-sm">
              {completedTreatiesCount}
            </div>
          </div>
        </div>
      </div>

      {finished && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 sm:p-5 flex items-center gap-3 text-emerald-950 shadow-sm animate-fade-in">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base">Etkinlik Başarıyla Tamamlandı</h4>
            <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
              17-18. Yüzyıl Osmanlı Diplomasisi analizini, neden-sonuç sınıflandırmalarını ve nedensellik zincirini eksiksiz tamamladınız.
            </p>
          </div>
        </div>
      )}

      {/* Tematik Filtreleme Butonları */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Karşılaştırma Boyutu Seçiniz:
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Farklı boyutlara dokunarak karşılaştırmalı analizi daraltabilir veya genel matrise dönebilirsiniz.
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {DIMENSIONS.map((dim) => {
            const isSelected = selectedDimension === dim.id;
            const Icon = dim.icon;

            return (
              <button
                key={dim.id}
                onClick={() => setSelectedDimension(dim.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-sm ring-2 ring-blue-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-blue-800 text-amber-300' : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate font-semibold">
                  {dim.shortLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Seçili Boyut Açıklaması */}
        <div className="bg-slate-50/80 rounded-lg p-2.5 text-xs text-slate-600 border border-slate-200/60 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-800 shrink-0" />
          <span>{currentDimInfo.description}</span>
        </div>
      </div>

      {/* 5 Antlaşmalı Karşılaştırma Izgarası */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-stretch">
        {COMPARISON_DATA.map((item) => {
          return (
            <div
              key={item.treatyId}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3.5 hover:shadow-sm transition-shadow"
            >
              {/* Kart Başlığı */}
              <div className="border-b border-slate-100 pb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-blue-950 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {item.year}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    #{item.treatyId === 'karlofca' ? 1 : item.treatyId === 'prut' ? 2 : item.treatyId === 'pasarofca' ? 3 : item.treatyId === 'belgrad' ? 4 : 5}
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
              <div className="space-y-2.5 text-xs grow">
                {/* Dış Politika Boyutu */}
                {(selectedDimension === 'all' || selectedDimension === 'foreign_policy') && (
                  <div className={`rounded-xl p-2.5 space-y-1 ${
                    selectedDimension === 'foreign_policy'
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 shadow-2xs'
                      : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-800">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                      <span>{item.foreignPolicy.tag}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-700 leading-snug">
                      {item.foreignPolicy.summary}
                    </p>
                  </div>
                )}

                {/* Karadeniz Boyutu */}
                {(selectedDimension === 'all' || selectedDimension === 'black_sea') && (
                  <div className={`rounded-xl p-2.5 space-y-1 ${
                    selectedDimension === 'black_sea'
                      ? 'bg-blue-50 border border-blue-200 text-blue-950 shadow-2xs'
                      : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-blue-950">
                      <Waves className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{item.blackSea.tag}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-700 leading-snug">
                      {item.blackSea.summary}
                    </p>
                  </div>
                )}

                {/* Diplomasi & Arabuluculuk Boyutu */}
                {(selectedDimension === 'all' || selectedDimension === 'diplomacy') && (
                  <div className={`rounded-xl p-2.5 space-y-1 ${
                    selectedDimension === 'diplomacy'
                      ? 'bg-amber-50 border border-amber-200 text-amber-950 shadow-2xs'
                      : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-950">
                      <Scroll className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{item.diplomacy.tag}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-700 leading-snug">
                      {item.diplomacy.summary}
                    </p>
                  </div>
                )}

                {/* İlkler & Kırılmalar Boyutu */}
                {(selectedDimension === 'all' || selectedDimension === 'breakthroughs') && (
                  <div className={`rounded-xl p-2.5 space-y-1 ${
                    selectedDimension === 'breakthroughs'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-2xs'
                      : 'bg-slate-50 border border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-950">
                      <Award className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{item.breakthroughs.tag}</span>
                    </div>
                    <p className="text-[11.5px] text-slate-700 leading-snug">
                      {item.breakthroughs.summary}
                    </p>
                  </div>
                )}
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
              <span>Nedensellik Zincirine Dön</span>
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
