import React, { useState, useMemo } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyId } from '../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CausalityChainProps {
  onGoToSummary?: () => void;
  onGoToPrevTab?: () => void;
}

interface ChainItem {
  id: string;
  treatyId: TreatyId;
  type: 'cause' | 'effect';
  text: string;
}

// Tarihî temaya uygun konfeti renkleri: parşömen, pirinç altın, mühür kırmızısı
const CONFETTI_COLORS = ['#e8d5a4', '#a3762a', '#7c1d1d', '#f6efdc', '#6f5228'];

// Halka metinleri ders kitabından (11.1.1.pdf) derlenmiştir ve Karadeniz'in statüsündeki
// değişimi anlatan KESİNTİSİZ tek bir zincir kurar: her antlaşmanın SONUCU bir sonraki
// antlaşmanın NEDENİNE bağlanır (Karlofça: Kaynak F/G · Prut: Kaynak J · Pasarofça: Kaynak L/N
// · Belgrad: Kaynak Q/T · Küçük Kaynarca: Kaynak U/Y/AA).
const CHAIN_ITEMS: ChainItem[] = [
  {
    id: 'k-neden',
    treatyId: 'karlofca',
    type: 'cause',
    text: 'Zenta bozgunu sonrası savaş yorgunu devlet, Karadeniz\'i savunamayacak duruma düştü.'
  },
  {
    id: 'k-sonuc',
    treatyId: 'karlofca',
    type: 'effect',
    text: 'Azak Kalesi Ruslara bırakıldı; Karadeniz ilk kez kuzeyden tehditle tanıştı.'
  },
  {
    id: 'p-neden',
    treatyId: 'prut',
    type: 'cause',
    text: 'Karadeniz\'in anahtarını geri almak isteyen Osmanlı, I. Petro\'yu Prut\'ta kuşattı.'
  },
  {
    id: 'p-sonuc',
    treatyId: 'prut',
    type: 'effect',
    text: 'Prut zaferiyle Azak geri alındı; Karadeniz yeniden yabancı donanmalara kapandı.'
  },
  {
    id: 'pas-neden',
    treatyId: 'pasarofca',
    type: 'cause',
    text: 'Avusturya\'nın Venedik yanında savaşa girmesi Tuna hattında yenilgiyi getirdi.'
  },
  {
    id: 'pas-sonuc',
    treatyId: 'pasarofca',
    type: 'effect',
    text: 'Belgrad kaybedildi ama Karadeniz yabancı donanmalara hâlâ kapalı kaldı.'
  },
  {
    id: 'b-neden',
    treatyId: 'belgrad',
    type: 'cause',
    text: 'Karadeniz\'de ilerleyen Rusya\'ya karşı Avusturya cephesinde Grocka zaferi kazanıldı.'
  },
  {
    id: 'b-sonuc',
    treatyId: 'belgrad',
    type: 'effect',
    text: 'Rus gemileri yasaklandı; Karadeniz\'in Türk gölü statüsü son kez onaylandı.'
  },
  {
    id: 'kk-neden',
    treatyId: 'kucuk_kaynarca',
    type: 'cause',
    text: 'Karadeniz yasağını kırmak isteyen II. Katerina, savaşı Kırım\'a taşıdı.'
  },
  {
    id: 'kk-sonuc',
    treatyId: 'kucuk_kaynarca',
    type: 'effect',
    text: 'Kırım elden çıktı, Rus gemileri Boğazlardan geçti; Türk gölü dönemi sona erdi.'
  }
];

export const CausalityChain: React.FC<CausalityChainProps> = ({ onGoToSummary }) => {
  const [placed, setPlaced] = useState<{ [slotKey: string]: string }>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({ type: null, message: '' });

  const isChainCompleted = Object.keys(placed).length === CHAIN_ITEMS.length;

  const slotKey = (treatyId: TreatyId, type: 'cause' | 'effect') => `${treatyId}::${type}`;

  // Havuzda kalan yerleştirilmemiş halkalar (karışık sırada)
  const unplacedItems = useMemo(() => {
    const placedValues = new Set(Object.values(placed));
    const remaining = CHAIN_ITEMS.filter(item => !placedValues.has(item.id));
    return [...remaining].sort((a, b) => b.id.localeCompare(a.id));
  }, [placed]);

  const handlePlaceItem = (item: ChainItem, targetTreaty: TreatyId, targetType: 'cause' | 'effect') => {
    const isCorrect = item.treatyId === targetTreaty && item.type === targetType;

    if (isCorrect) {
      const updated = { ...placed, [slotKey(targetTreaty, targetType)]: item.id };
      setPlaced(updated);
      setSelectedItemId(null);
      setLastFeedback({ type: 'correct', message: 'Doğru' });

      if (Object.keys(updated).length === CHAIN_ITEMS.length) {
        confetti({
          particleCount: 100,
          spread: 85,
          origin: { y: 0.6 },
          colors: CONFETTI_COLORS
        });
      }
    } else {
      setLastFeedback({
        type: 'wrong',
        message: 'Bu halkaya uymadı. Maddenin hangi antlaşmaya ait olduğunu ve akışta neden mi sonuç mu olduğunu yeniden değerlendiriniz.'
      });
    }
  };

  const handleRemoveItem = (key: string) => {
    const updated = { ...placed };
    delete updated[key];
    setPlaced(updated);
    setLastFeedback({ type: null, message: '' });
  };

  const handleReset = () => {
    setPlaced({});
    setSelectedItemId(null);
    setLastFeedback({ type: null, message: '' });
  };

  // Drag & drop
  const handleDragStart = (e: React.DragEvent, item: ChainItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent, targetTreaty: TreatyId, targetType: 'cause' | 'effect') => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const item: ChainItem = JSON.parse(dataStr);
        handlePlaceItem(item, targetTreaty, targetType);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Zincir halkaları: her antlaşma için [Neden halkası] – [Antlaşma mührü] – [Sonuç halkası].
  // Negatif kenar boşlukları ve almaşık z-katmanlarıyla halkalar iç içe geçerek
  // gerçek bir zincir gibi birbirine bağlı görünür; ayrı ayrı durmazlar.
  let linkIndex = 0;

  const renderRing = (treatyId: TreatyId, type: 'cause' | 'effect') => {
    const key = slotKey(treatyId, type);
    const placedId = placed[key];
    const placedItem = CHAIN_ITEMS.find(i => i.id === placedId);
    const zIndex = linkIndex % 2 === 0 ? 20 : 10;
    linkIndex++;

    const treaty = TREATIES.find(t => t.id === treatyId)!;
    const slotTitle = `${treaty.title} — ${type === 'cause' ? 'Nedenleri' : 'Sonuçları'}`;
    const isHighlightable = !!selectedItemId;

    return (
      <div
        key={key}
        onDrop={(e) => handleDrop(e, treatyId, type)}
        onDragOver={handleDragOver}
        onClick={() => {
          if (!selectedItemId) return;
          const item = CHAIN_ITEMS.find(i => i.id === selectedItemId);
          if (item) handlePlaceItem(item, treatyId, type);
        }}
        title={placedItem ? placedItem.text : slotTitle}
        style={{ zIndex }}
        className={`relative shrink-0 -ml-3.5 w-[108px] min-h-[168px] sm:w-[116px] sm:min-h-[176px] xl:w-[124px] xl:min-h-[188px] rounded-full flex flex-col items-center justify-center p-2 sm:p-2.5 text-center transition-all cursor-pointer ${
          placedItem
            ? 'bg-[#eef0da] border-[3px] border-olive-seal shadow-parchment'
            : isHighlightable
            ? 'bg-brass/15 border-[3px] border-seal ring-2 ring-seal/40 cursor-pointer animate-pulse'
            : 'parchment-deep border-[3px] border-brass/80 hover:border-brass shadow-parchment'
        }`}
      >
        {placedItem ? (
          <div className="flex flex-col items-center justify-center space-y-1 text-center w-full">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-olive-seal text-parchment-100 flex items-center justify-center shadow-2xs shrink-0">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
            <p className="text-[9.5px] sm:text-[10px] xl:text-[11px] font-semibold text-ink leading-snug">
              {placedItem.text}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveItem(key);
              }}
              className="text-[9.5px] sm:text-[10px] text-seal hover:text-seal-dark font-bold underline hover:no-underline cursor-pointer shrink-0"
              title="Halkayı kaldır"
            >
              Kaldır
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-0.5 text-center">
            <span className={`text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider ${type === 'cause' ? 'text-brass' : 'text-seal'}`}>
              {type === 'cause' ? 'Neden' : 'Sonuç'}
            </span>
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-ink-soft leading-tight">
              {isHighlightable ? 'Buraya Yerleştir' : 'Sürükle veya seç'}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderSeal = (treatyId: TreatyId, year: number, shortName: string) => {
    const zIndex = linkIndex % 2 === 0 ? 30 : 40;
    linkIndex++;
    return (
      <div
        key={`seal-${treatyId}`}
        style={{ zIndex }}
        className="relative shrink-0 -ml-3.5 w-12 h-12 sm:w-[52px] sm:h-[52px] xl:w-[56px] xl:h-[56px] rounded-full bg-gradient-to-b from-seal-light via-seal to-seal-dark text-parchment-100 flex flex-col items-center justify-center p-0.5 text-center border-[3px] border-brass shadow-wax"
      >
        <span className="text-[10px] sm:text-[11px] font-black font-mono text-brass-pale leading-none">
          {year}
        </span>
        <span className="text-[7.5px] sm:text-[8.5px] font-bold text-parchment-100 leading-tight mt-0.5 px-0.5 text-center">
          {shortName}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Ana Kart */}
      <div className="parchment-surface rounded-2xl border-2 border-parchment-400/70 shadow-parchment overflow-hidden">
        {/* Açıklama ve Sıfırlama Şeridi */}
        <div className="parchment-deep px-5 sm:px-6 py-3 border-b border-parchment-400/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-ink-light">
          <div>
            Aşağıdaki maddeleri inceleyiniz; Karadeniz'in statüsündeki değişimi anlatan zinciri kurunuz. Her antlaşmanın solundaki halkaya o antlaşmayı doğuran NEDENİ, sağındaki halkaya ise SONUÇLARINI yerleştiriniz.
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink px-2 py-1 rounded hover:bg-parchment-300 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zinciri Sıfırla</span>
          </button>
        </div>

        {/* Zincir Rayı: iç içe geçmiş halkalar */}
        <div className="py-5 px-2 sm:px-4 bg-parchment-300/40 border-b border-parchment-400/70">
          <div className="overflow-x-auto pb-2 pt-1 scrollbar-thin">
            <div className="flex items-center justify-center min-w-[1000px] lg:min-w-0 px-2">
              {TREATIES.map((treaty) => (
                <React.Fragment key={treaty.id}>
                  {renderRing(treaty.id, 'cause')}
                  {renderSeal(
                    treaty.id,
                    treaty.year,
                    treaty.title.replace(' Antlaşması', '')
                  )}
                  {renderRing(treaty.id, 'effect')}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Alt Alan: Yerleştirilmeyi Bekleyen Maddeler Havuzu */}
        {unplacedItems.length > 0 && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {unplacedItems.map((item) => {
                const isSelected = selectedItemId === item.id;

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                    className={`rounded-2xl p-3.5 transition-all parchment-deep shadow-2xs cursor-grab active:cursor-grabbing select-none flex flex-col justify-between border-2 ${
                      isSelected
                        ? 'border-seal ring-2 ring-seal/40 bg-seal/10 shadow-parchment scale-[1.02]'
                        : 'border-parchment-500/70 hover:border-brass hover:shadow-parchment'
                    }`}
                  >
                    <p className="text-xs sm:text-sm text-ink leading-relaxed font-semibold">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alt Geri Bildirim Şeridi */}
        {lastFeedback.type && unplacedItems.length > 0 && (
          <div className="px-5 sm:px-6 pb-4">
            <div
              className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-2xs ${
                lastFeedback.type === 'correct'
                  ? 'bg-[#eef0da] text-[#2f3a10] border-olive-seal/50 font-bold'
                  : 'bg-[#f5e2de] text-seal-dark border-seal/50 font-medium'
              }`}
            >
              {lastFeedback.type === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-olive-seal shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-seal shrink-0" />
              )}
              <p className="leading-snug">
                {lastFeedback.message}
              </p>
            </div>
          </div>
        )}

        {/* Zincir Tamamlandığında Açılan Sonraki Aşamaya Geçiş Alanı */}
        {isChainCompleted && onGoToSummary && (
          <div className="p-4 sm:p-5 border-t border-parchment-400/70 flex items-center justify-center animate-fade-in">
            <button
              onClick={onGoToSummary}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-parchment-100 bg-gradient-to-r from-olive-seal to-[#3d4c18] hover:from-[#3d4c18] hover:to-olive-seal border border-brass/60 shadow-wax hover:shadow-parchment transition-all cursor-pointer animate-pulse"
            >
              <span>Sonraki Aşamaya Geç (Karşılaştırmalı Analiz)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
