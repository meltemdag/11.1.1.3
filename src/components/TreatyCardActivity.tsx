import React, { useState, useEffect, useMemo } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyId, TreatyItem, TreatyProgress } from '../types';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatyCardActivityProps {
  currentTreatyId: TreatyId;
  onSelectTreaty?: (id: TreatyId) => void;
  progress: TreatyProgress;
  onUpdateProgress: (id: TreatyId, causes: string[], effects: string[], isCompleted: boolean) => void;
  onClose?: () => void;
  onGoToNextTab?: () => void;
  onGoToPrevTab?: () => void;
}

// Tarihî temaya uygun konfeti renkleri: parşömen, pirinç altın, mühür kırmızısı
const CONFETTI_COLORS = ['#e8d5a4', '#a3762a', '#7c1d1d', '#f6efdc', '#6f5228'];

export const TreatyCardActivity: React.FC<TreatyCardActivityProps> = ({
  currentTreatyId,
  progress,
  onUpdateProgress,
  onClose,
  onGoToNextTab,
  onGoToPrevTab
}) => {
  const treaty = TREATIES.find(t => t.id === currentTreatyId) || TREATIES[0];

  const completedCount = TREATIES.filter(t => progress[t.id]?.completed).length;
  const allCompleted = completedCount === TREATIES.length;

// Fisher-Yates karıştırma algoritması
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

  // Kullanıcının yerleştirdiği maddeler
  const [placedCauses, setPlacedCauses] = useState<string[]>([]);
  const [placedEffects, setPlacedEffects] = useState<string[]>([]);

  // Dokunmatik cihazlar için seçili kart durumu
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Maddelerin rastgele karıştırılmış ID sırası
  const [shuffledItemIds, setShuffledItemIds] = useState<string[]>([]);

  // Geri bildirim mesajı ve son deneme durumu
  const [lastFeedback, setLastFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({ type: null, message: '' });

  // Escape tuşu ile modalı kapatma desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        (onClose || onGoToPrevTab)?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onGoToPrevTab]);

  // Mevcut antlaşma değiştiğinde veya kayıtlı ilerleme olduğunda durum güncelleme
  useEffect(() => {
    const saved = progress[treaty.id];
    if (saved) {
      setPlacedCauses(saved.causesPlaced);
      setPlacedEffects(saved.effectsPlaced);
    } else {
      setPlacedCauses([]);
      setPlacedEffects([]);
    }
    setSelectedCardId(null);
    setLastFeedback({ type: null, message: '' });
    // Maddeleri rastgele karıştır (asla aynı sırada olmasın)
    setShuffledItemIds(shuffleArray(treaty.items.map(item => item.id)));
  }, [treaty.id]);

  // Seçenekleri karıştırma: Her açılışta rastgele karıştırılmış sırada sunulur
  const unplacedItems = useMemo(() => {
    const placedSet = new Set([...placedCauses, ...placedEffects]);
    const remainingIds = shuffledItemIds.filter(id => !placedSet.has(id));
    if (remainingIds.length === 0 && treaty.items.length > placedSet.size) {
      return shuffleArray(treaty.items.filter(item => !placedSet.has(item.id)));
    }
    return remainingIds
      .map(id => treaty.items.find(item => item.id === id))
      .filter((item): item is TreatyItem => item !== undefined);
  }, [treaty.items, placedCauses, placedEffects, shuffledItemIds]);

  // Bir maddenin yerleştirilmesi işlemi
  const handlePlaceItem = (item: TreatyItem, target: 'cause' | 'effect') => {
    const isCorrect = item.type === target;

    if (isCorrect) {
      const newCauses = target === 'cause' ? [...placedCauses, item.id] : placedCauses;
      const newEffects = target === 'effect' ? [...placedEffects, item.id] : placedEffects;

      setPlacedCauses(newCauses);
      setPlacedEffects(newEffects);
      setSelectedCardId(null);
      setLastFeedback({
        type: 'correct',
        message: 'Doğru'
      });

      // Tüm maddeler doğru yerleştirildi mi kontrolü
      const totalPlaced = newCauses.length + newEffects.length;
      if (totalPlaced === treaty.items.length) {
        onUpdateProgress(treaty.id, newCauses, newEffects, true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: CONFETTI_COLORS
        });
      } else {
        onUpdateProgress(treaty.id, newCauses, newEffects, false);
      }
    } else {
      // Düşünelim yönlendirmesi (Karta özel, cevabı doğrudan vermeden düşündüren kısa yönlendirme)
      setLastFeedback({
        type: 'wrong',
        message: item.guidingHint || (
          target === 'cause'
            ? 'Bu gelişmenin antlaşmaya zemin mi hazırladığını değerlendiriniz.'
            : 'Bu gelişmenin antlaşmanın ardından ortaya çıkan bir durum mu olduğunu değerlendiriniz.'
        )
      });
    }
  };

  // HTML5 Drag & Drop işlemleri
  const handleDragStart = (e: React.DragEvent, item: TreatyItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent, target: 'cause' | 'effect') => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const item: TreatyItem = JSON.parse(dataStr);
        handlePlaceItem(item, target);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const boardHighlight = selectedCardId
    ? 'border-brass bg-brass/10 ring-2 ring-brass/40 cursor-pointer'
    : 'border-parchment-500/70 parchment-deep hover:border-brass/60';

  const renderBoard = (
    boardTitle: string,
    dotColor: string,
    placed: string[],
    dropTarget: 'cause' | 'effect'
  ) => (
    <div
      onDrop={(e) => handleDrop(e, dropTarget)}
      onDragOver={handleDragOver}
      onClick={() => {
        if (selectedCardId) {
          const item = treaty.items.find(i => i.id === selectedCardId);
          if (item) handlePlaceItem(item, dropTarget);
        }
      }}
      className={`rounded-xl border-2 p-4 transition-all min-h-[16rem] flex flex-col justify-start ${boardHighlight}`}
    >
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-parchment-500/50 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full shadow-wax ${dotColor}`}></span>
            <h3 className="font-antique font-bold text-ink text-base sm:text-lg">
              {boardTitle}
            </h3>
          </div>
        </div>

        {placed.length > 0 && (
          <div className="space-y-2.5">
            {placed.map(id => {
              const item = treaty.items.find(i => i.id === id)!;
              return (
                <div
                  key={id}
                  className="bg-[#eef0da] border border-olive-seal/50 rounded-lg p-3 text-xs sm:text-sm text-ink shadow-2xs flex items-start gap-2.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 text-olive-seal shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const boardTitles = getBoardTitles(treaty.id);
  const isCurrentTreatyCompleted = progress[treaty.id]?.completed || (placedCauses.length + placedEffects.length === treaty.items.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          (onClose || onGoToPrevTab)?.();
        }
      }}
    >
      {/* Modal Kartı */}
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col parchment-surface rounded-2xl border-2 border-brass shadow-parchment-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Üst Altın Çizgi Bandı */}
        <div className="h-[3px] w-full bg-gradient-to-r from-brass/20 via-brass-light to-brass/20 shrink-0" />

        {/* Modal Başlık Çubuğu */}
        <div className="parchment-deep px-5 sm:px-6 py-3.5 border-b border-parchment-400/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-antique font-bold text-lg sm:text-xl text-ink tracking-tight">
              {treaty.title}
            </h2>
            <span className="text-xs font-bold text-brass bg-brass/15 px-2.5 py-0.5 rounded-full border border-brass/40">
              {treaty.year}
            </span>
          </div>
        </div>

        {/* Modal Gövdesi (Kaydırılabilir İçerik) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 scrollbar-thin">
          {/* Görev Açıklaması */}
          <div className="parchment-deep px-4 sm:px-5 py-3 rounded-xl border border-parchment-400/70 text-xs sm:text-sm text-ink-light">
            <p className="leading-relaxed">
              Antlaşmaya ait gelişmeleri inceleyiniz; olayları antlaşmaya yol açan nedenler ve antlaşma sonrasında ortaya çıkan sonuçlar olarak ilgili panolara yerleştiriniz.
            </p>
          </div>

          {/* Geri Bildirim Şeridi */}
          {lastFeedback.type && (
            <div
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm flex gap-2.5 transition-all ${
                lastFeedback.type === 'correct'
                  ? 'bg-[#eef0da] text-[#2f3a10] border-olive-seal/40 items-center'
                  : 'bg-[#f5e2de] text-seal-dark border-seal/40 items-start'
              }`}
            >
              {lastFeedback.type === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-olive-seal shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-seal shrink-0 mt-0.5" />
              )}
              {lastFeedback.type === 'correct' ? (
                <span className="font-bold text-sm">Doğru</span>
              ) : (
                <div>
                  <span className="font-bold block">Düşünelim</span>
                  <p className="mt-0.5 leading-relaxed">{lastFeedback.message}</p>
                </div>
              )}
            </div>
          )}

          {/* İki Hedef Pano (Nedenler ve Sonuçlar) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Nedenler Panosu */}
            {renderBoard(
              boardTitles.causes,
              'bg-brass',
              placedCauses,
              'cause'
            )}

            {/* 2. Sonuçlar Panosu */}
            {renderBoard(
              boardTitles.effects,
              'bg-seal',
              placedEffects,
              'effect'
            )}
          </div>

          {/* Yerleştirilmeyi Bekleyen Madde Kartları Havuzu */}
          {unplacedItems.length > 0 && (
            <div className="border-t border-parchment-400/70 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unplacedItems.map((item) => {
                  const isSelected = selectedCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => setSelectedCardId(isSelected ? null : item.id)}
                      className={`relative border rounded-xl p-3.5 transition-all parchment-deep shadow-2xs cursor-grab active:cursor-grabbing select-none ${
                        isSelected
                          ? 'border-seal ring-2 ring-seal/40 bg-seal/10 shadow-parchment scale-[1.01]'
                          : 'border-parchment-500/70 hover:border-brass hover:shadow-parchment'
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Alt Çubuğu */}
        <div className="parchment-deep px-5 sm:px-6 py-3.5 border-t border-parchment-400/70 flex items-center justify-end gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {allCompleted && onGoToNextTab && (
              <button
                onClick={onGoToNextTab}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-parchment-100 bg-gradient-to-r from-olive-seal to-[#3d4c18] hover:from-[#3d4c18] hover:to-olive-seal border border-brass/60 shadow-wax hover:shadow-parchment transition-all cursor-pointer animate-pulse"
              >
                <span>Diplomasi Zincirine İlerle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose || onGoToPrevTab}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isCurrentTreatyCompleted
                  ? 'bg-gradient-to-b from-olive-seal to-[#3d4c18] text-parchment-100 border border-brass/60 shadow-wax hover:shadow-parchment'
                  : 'bg-gradient-to-b from-ink-light to-ink text-parchment-100 border border-brass/50 hover:from-ink hover:to-ink shadow-wax'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Haritaya Dön</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function getBoardTitles(id: TreatyId) {
  switch (id) {
    case 'karlofca':
      return {
        causes: "Karlofça'nın Nedenleri",
        effects: "Karlofça'nın Sonuçları"
      };
    case 'prut':
      return {
        causes: "Prut'un Nedenleri",
        effects: "Prut'un Sonuçları"
      };
    case 'pasarofca':
      return {
        causes: "Pasarofça'nın Nedenleri",
        effects: "Pasarofça'nın Sonuçları"
      };
    case 'belgrad':
      return {
        causes: "Belgrad'ın Nedenleri",
        effects: "Belgrad'ın Sonuçları"
      };
    case 'kucuk_kaynarca':
      return {
        causes: "Küçük Kaynarca'nın Nedenleri",
        effects: "Küçük Kaynarca'nın Sonuçları"
      };
    default:
      return {
        causes: "Nedenler",
        effects: "Sonuçlar"
      };
  }
}
