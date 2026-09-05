import React, { useState, useEffect, useMemo } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyId, TreatyItem, TreatyProgress } from '../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatyCardActivityProps {
  currentTreatyId: TreatyId;
  onSelectTreaty?: (id: TreatyId) => void;
  progress: TreatyProgress;
  onUpdateProgress: (id: TreatyId, causes: string[], effects: string[], isCompleted: boolean) => void;
  onGoToNextTab?: () => void;
  onGoToPrevTab?: () => void;
}

// Tarihî temaya uygun konfeti renkleri: parşömen, pirinç altın, mühür kırmızısı
const CONFETTI_COLORS = ['#e8d5a4', '#a3762a', '#7c1d1d', '#f6efdc', '#6f5228'];

export const TreatyCardActivity: React.FC<TreatyCardActivityProps> = ({
  currentTreatyId,
  progress,
  onUpdateProgress,
  onGoToPrevTab
}) => {
  const treaty = TREATIES.find(t => t.id === currentTreatyId) || TREATIES[0];

  // Kullanıcının yerleştirdiği maddeler
  const [placedCauses, setPlacedCauses] = useState<string[]>([]);
  const [placedEffects, setPlacedEffects] = useState<string[]>([]);

  // Dokunmatik cihazlar için seçili kart durumu
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Geri bildirim mesajı ve son deneme durumu
  const [lastFeedback, setLastFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({ type: null, message: '' });

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
  }, [treaty.id]);

  // Seçenekleri karıştırma: Başlangıçta hedef alanlarla eşleşmeyecek ve tahmin ettirmeyecek asimetrik düzen
  const unplacedItems = useMemo(() => {
    const placedSet = new Set([...placedCauses, ...placedEffects]);
    const remaining = treaty.items.filter(item => !placedSet.has(item.id));

    // Asimetrik karıştırma: Neden ve sonuçları dönüşümlü ve ters sırada dizecek deterministik/kontrollü yapı
    return [...remaining].sort((a, b) => {
      // id hash veya ters sıralama ile yapay hizayı engelleme
      return a.id.localeCompare(b.id) * -1;
    });
  }, [treaty.items, placedCauses, placedEffects]);

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
        message: item.explanation
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
      // Hatalı yerleştirme
      setLastFeedback({
        type: 'wrong',
        message: target === 'cause'
          ? 'Bu madde bir neden değil, antlaşmanın doğurduğu bir sonuçtur. Lütfen ifadenin olaydan önce mi sonra mı gerçekleştiğini değerlendiriniz.'
          : 'Bu madde bir sonuç değil, antlaşmaya ve savaşa yol açan bir nedendir. Lütfen ifadenin olaydan önce mi sonra mı gerçekleştiğini değerlendiriniz.'
      });
    }
  };

  // Kartı havuzdan geri çekme (kaldırma)
  const handleRemoveItem = (itemId: string, source: 'cause' | 'effect') => {
    if (source === 'cause') {
      const updated = placedCauses.filter(id => id !== itemId);
      setPlacedCauses(updated);
      onUpdateProgress(treaty.id, updated, placedEffects, false);
    } else {
      const updated = placedEffects.filter(id => id !== itemId);
      setPlacedEffects(updated);
      onUpdateProgress(treaty.id, placedCauses, updated, false);
    }
    setLastFeedback({ type: null, message: '' });
  };

  // Bu antlaşmayı baştan deneme
  const handleResetCurrent = () => {
    setPlacedCauses([]);
    setPlacedEffects([]);
    setSelectedCardId(null);
    setLastFeedback({ type: null, message: '' });
    onUpdateProgress(treaty.id, [], [], false);
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
    source: 'cause' | 'effect',
    dropTarget: 'cause' | 'effect',
    placeholder: string
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
      className={`rounded-xl border-2 p-4 transition-all min-h-[16rem] flex flex-col justify-between ${boardHighlight}`}
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
                  className="bg-[#eef0da] border border-olive-seal/50 rounded-lg p-3 text-xs sm:text-sm text-ink shadow-2xs flex items-start justify-between gap-2 transition-all"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-olive-seal shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item.text}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(id, source);
                    }}
                    className="text-seal hover:text-seal-dark p-1 hover:bg-seal/10 rounded text-xs shrink-0"
                    title="Maddeleri kaldır"
                  >
                    Kaldır
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCardId && (
        <div className="mt-3 pt-2 border-t border-brass/40 text-center text-xs font-semibold text-seal-dark animate-pulse">
          {placeholder}
        </div>
      )}
    </div>
  );

  const boardTitles = getBoardTitles(treaty.id);

  return (
    <div className="space-y-4">
      {/* Ana Çalışma Alanı: Olay Bilgi Kartı Formatı */}
      <div className="parchment-surface rounded-2xl border-2 border-parchment-400/70 shadow-parchment overflow-hidden">
        {/* Görev Açıklaması */}
        <div className="parchment-deep px-5 sm:px-6 py-3.5 border-b border-parchment-400/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-ink-light">
          <div>
            Aşağıda verilen maddeleri inceleyiniz; maddeleri sürükleyerek ya da karta dokunup ilgili panoyu seçerek yerleştiriniz.
          </div>
          <button
            onClick={handleResetCurrent}
            className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink px-2 py-1 rounded hover:bg-parchment-300 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Kartı Temizle</span>
          </button>
        </div>

        {/* Geri Bildirim Şeridi */}
        {lastFeedback.type && (
          <div
            className={`px-5 py-3 border-b text-xs sm:text-sm flex items-start gap-2.5 transition-all ${
              lastFeedback.type === 'correct'
                ? 'bg-[#eef0da] text-[#2f3a10] border-olive-seal/40'
                : 'bg-[#f5e2de] text-seal-dark border-seal/40'
            }`}
          >
            {lastFeedback.type === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-olive-seal shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-seal shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">
                {lastFeedback.type === 'correct' ? 'Doğru Değerlendirme' : 'Hatalı Yerleştirme'}
              </span>
              <p className="mt-0.5 leading-relaxed">{lastFeedback.message}</p>
            </div>
          </div>
        )}

        {/* Etkileşimli Alan: Hedef Panolar ve Madde Havuzu */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* İki Hedef Pano (Nedenler ve Sonuçlar) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Nedenler Panosu */}
            {renderBoard(
              boardTitles.causes,
              'bg-brass',
              placedCauses,
              'cause',
              'cause',
              'Seçili maddeyi buraya "Neden" olarak yerleştirmek için tıklayınız'
            )}

            {/* 2. Sonuçlar Panosu */}
            {renderBoard(
              boardTitles.effects,
              'bg-seal',
              placedEffects,
              'effect',
              'effect',
              'Seçili maddeyi buraya "Sonuç" olarak yerleştirmek için tıklayınız'
            )}
          </div>

          {/* Yerleştirilmeyi Bekleyen Madde Kartları Havuzu */}
          {unplacedItems.length > 0 && (
            <div className="border-t border-parchment-400/70 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unplacedItems.map((item) => {
                  const isSelected = selectedCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => setSelectedCardId(isSelected ? null : item.id)}
                      className={`relative border rounded-xl p-4 transition-all parchment-deep shadow-2xs cursor-grab active:cursor-grabbing select-none ${
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

        {/* Alt Gezinme: Haritaya Dön Butonu (Ortalanmış) */}
        {onGoToPrevTab && (
          <div className="parchment-deep px-5 sm:px-6 py-4 border-t border-parchment-400/70 flex items-center justify-center">
            <button
              onClick={onGoToPrevTab}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-parchment-100 bg-gradient-to-b from-ink-light to-ink border border-brass/50 hover:from-ink hover:to-ink transition-colors shadow-wax cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Haritaya Dön</span>
            </button>
          </div>
        )}
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
