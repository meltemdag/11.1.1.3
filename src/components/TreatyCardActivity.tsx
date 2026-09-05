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
          origin: { y: 0.7 }
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



  const getBoardTitles = (id: TreatyId) => {
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
  };

  const boardTitles = getBoardTitles(treaty.id);

  return (
    <div className="space-y-4">
      {/* Ana Çalışma Alanı: Olay Bilgi Kartı Formatı */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Görev Açıklaması */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-700">
          <div>
            Aşağıda verilen maddeleri inceleyiniz; maddeleri sürükleyerek ya da karta dokunup ilgili panoyu seçerek yerleştiriniz.
          </div>
          <button
            onClick={handleResetCurrent}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors shrink-0"
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
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {lastFeedback.type === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
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
            <div
              onDrop={(e) => handleDrop(e, 'cause')}
              onDragOver={handleDragOver}
              onClick={() => {
                if (selectedCardId) {
                  const item = treaty.items.find(i => i.id === selectedCardId);
                  if (item) handlePlaceItem(item, 'cause');
                }
              }}
              className={`rounded-xl border-2 p-4 transition-all min-h-[16rem] flex flex-col justify-between ${
                selectedCardId
                  ? 'border-blue-400 bg-blue-50/40 cursor-pointer ring-2 ring-blue-200'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {boardTitles.causes}
                    </h3>
                  </div>
                </div>

                {placedCauses.length > 0 && (
                  <div className="space-y-2.5">
                    {placedCauses.map(id => {
                      const item = treaty.items.find(i => i.id === id)!;
                      return (
                        <div
                          key={id}
                          className="bg-emerald-50 border border-emerald-400 rounded-lg p-3 text-xs sm:text-sm text-emerald-950 shadow-sm flex items-start justify-between gap-2 transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item.text}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(id, 'cause');
                            }}
                            className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100 rounded text-xs shrink-0"
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
                <div className="mt-3 pt-2 border-t border-blue-200 text-center text-xs font-semibold text-blue-800 animate-pulse">
                  Seçili maddeyi buraya "Neden" olarak yerleştirmek için tıklayınız
                </div>
              )}
            </div>

            {/* 2. Sonuçlar Panosu */}
            <div
              onDrop={(e) => handleDrop(e, 'effect')}
              onDragOver={handleDragOver}
              onClick={() => {
                if (selectedCardId) {
                  const item = treaty.items.find(i => i.id === selectedCardId);
                  if (item) handlePlaceItem(item, 'effect');
                }
              }}
              className={`rounded-xl border-2 p-4 transition-all min-h-[16rem] flex flex-col justify-between ${
                selectedCardId
                  ? 'border-blue-400 bg-blue-50/40 cursor-pointer ring-2 ring-blue-200'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-700"></span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {boardTitles.effects}
                    </h3>
                  </div>
                </div>

                {placedEffects.length > 0 && (
                  <div className="space-y-2.5">
                    {placedEffects.map(id => {
                      const item = treaty.items.find(i => i.id === id)!;
                      return (
                        <div
                          key={id}
                          className="bg-emerald-50 border border-emerald-400 rounded-lg p-3 text-xs sm:text-sm text-emerald-950 shadow-sm flex items-start justify-between gap-2 transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item.text}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(id, 'effect');
                            }}
                            className="text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-100 rounded text-xs shrink-0"
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
                <div className="mt-3 pt-2 border-t border-blue-200 text-center text-xs font-semibold text-blue-800 animate-pulse">
                  Seçili maddeyi buraya "Sonuç" olarak yerleştirmek için tıklayınız
                </div>
              )}
            </div>
          </div>

          {/* Yerleştirilmeyi Bekleyen Madde Kartları Havuzu */}
          {unplacedItems.length > 0 && (
            <div className="border-t border-slate-200 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {unplacedItems.map((item) => {
                  const isSelected = selectedCardId === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onClick={() => setSelectedCardId(isSelected ? null : item.id)}
                      className={`relative border rounded-xl p-4 transition-all bg-white shadow-xs cursor-grab active:cursor-grabbing select-none ${
                        isSelected
                          ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50/40 shadow-md scale-[1.01]'
                          : 'border-slate-200 hover:border-blue-400 hover:shadow-sm hover:bg-slate-50/50'
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
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
          <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex items-center justify-center">
            <button
              onClick={onGoToPrevTab}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
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
