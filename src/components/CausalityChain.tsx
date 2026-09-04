import React, { useState, useMemo } from 'react';
import { TREATIES } from '../data/treaties';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Link2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CausalityChainProps {
  onGoToSummary: () => void;
  onGoToPrevTab?: () => void;
}

interface ChainLinkItem {
  id: string;
  targetSlotIndex: number;
  text: string;
  explanation: string;
}

const CHAIN_LINKS: ChainLinkItem[] = [
  {
    id: 'link_1',
    targetSlotIndex: 0,
    text: "Batıda yaşanan ağır toprak kayıplarını telafi etme arzusu ve Karadeniz güvenliği için Azak Kalesi'nin hedeflenmesi",
    explanation: "Batıdaki ilk büyük toprak kayıpları sonrası ortaya çıkan telafi politikası, Karadeniz güvenliğini sağlama seferine yol açmıştır."
  },
  {
    id: 'link_2',
    targetSlotIndex: 1,
    text: "Kuzeyde kazanılan başarının verdiği cesaretle Mora'nın geri alınması ve Avusturya'nın savaşa dahil olması",
    explanation: "Kuzey cephesindeki başarı diğer kayıpların da geri alınabileceği inancını artırmış; Mora Seferi Avusturya'nın savaşa girmesini tetiklemiştir."
  },
  {
    id: 'link_3',
    targetSlotIndex: 2,
    text: "Tuna savunma hattının çökmesi üzerine yapılan askeri ıslahatlar ve kaybedilen stratejik kalenin geri alınması",
    explanation: "Tuna boyundaki hayati kalenin kaybı üzerine başlatılan topçu ve askeri ıslahatlar, iki cepheli mücadelede zafere dönüşmüştür."
  },
  {
    id: 'link_4',
    targetSlotIndex: 3,
    text: "Yarım asır süren uzun barışın orduda rehavet yaratması ve Rusya'nın sıcak denizlere inmek için Lehistan'a müdahalesi",
    explanation: "Uzun barış döneminin getirdiği askeri hazırlıksızlık, Rusya'nın güneye inme politikasıyla birleşerek ağır kayıplara yol açmıştır."
  }
];

export const CausalityChain: React.FC<CausalityChainProps> = ({ onGoToSummary, onGoToPrevTab }) => {
  const [placedLinks, setPlacedLinks] = useState<{ [slotIndex: number]: string }>({});
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{
    type: 'correct' | 'wrong' | null;
    message: string;
  }>({ type: null, message: '' });

  // Havuzda kalan yerleştirilmemiş bağlantı halkaları (karışık sırada)
  const unplacedLinks = useMemo(() => {
    const placedValues = new Set(Object.values(placedLinks));
    const remaining = CHAIN_LINKS.filter(link => !placedValues.has(link.id));
    return [...remaining].sort((a, b) => b.id.localeCompare(a.id));
  }, [placedLinks]);

  const handlePlaceLink = (linkItem: ChainLinkItem, slotIndex: number) => {
    const isCorrect = linkItem.targetSlotIndex === slotIndex;

    if (isCorrect) {
      const updated = { ...placedLinks, [slotIndex]: linkItem.id };
      setPlacedLinks(updated);
      setSelectedLinkId(null);
      setLastFeedback({
        type: 'correct',
        message: linkItem.explanation
      });

      if (Object.keys(updated).length === CHAIN_LINKS.length) {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.65 }
        });
      }
    } else {
      setLastFeedback({
        type: 'wrong',
        message: 'Bu bağlantı maddesi seçtiğiniz antlaşmalar arasındaki kronolojik ve nedensel süreci ifade etmemektedir. Olayların gelişimini inceleyiniz.'
      });
    }
  };

  const handleRemoveLink = (slotIndex: number) => {
    const updated = { ...placedLinks };
    delete updated[slotIndex];
    setPlacedLinks(updated);
    setLastFeedback({ type: null, message: '' });
  };

  const handleReset = () => {
    setPlacedLinks({});
    setSelectedLinkId(null);
    setLastFeedback({ type: null, message: '' });
  };

  // Drag & drop
  const handleDragStart = (e: React.DragEvent, linkItem: ChainLinkItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(linkItem));
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const item: ChainLinkItem = JSON.parse(dataStr);
        handlePlaceLink(item, slotIndex);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Ana Kart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Yönlendirme Şeridi */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-700">
          <div>
            Aşağıdaki nedensellik maddelerini inceleyiniz; ardışık antlaşmalar arasındaki boş zincir halkalarına yerleştirerek zinciri tamamlayınız.
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zinciri Sıfırla</span>
          </button>
        </div>

        {/* Üst Alan: Yatay Zincir Halkaları Rayı */}
        <div className="p-5 sm:p-6 bg-slate-900/5 border-b border-slate-200">
          <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin">
            <div className="min-w-[920px] flex items-center justify-between gap-2 px-2">
              {TREATIES.map((treaty, idx) => {
                const isLast = idx === TREATIES.length - 1;
                const slotIndex = idx;
                const placedLinkId = placedLinks[slotIndex];
                const placedLinkItem = CHAIN_LINKS.find(l => l.id === placedLinkId);

                return (
                  <React.Fragment key={treaty.id}>
                    {/* Antlaşma Yuvarlak Halkası */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col items-center justify-center p-2.5 text-center border-4 border-amber-400 shadow-lg relative group transition-transform hover:scale-105">
                        <span className="text-sm sm:text-base font-extrabold font-mono text-amber-300">
                          {treaty.year}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold text-white leading-tight line-clamp-2 mt-1">
                          {treaty.title.replace(' Antlaşması', '')}
                        </span>
                      </div>
                    </div>

                    {/* İki Antlaşma Arasındaki Bağlantı Halkası (Zincir Yuvası) */}
                    {!isLast && (
                      <div className="flex items-center shrink-0">
                        {/* Sol Zincir Bağlantı Çubuğu */}
                        <div className="w-3 sm:w-4 h-2 bg-gradient-to-r from-amber-400 to-slate-400 rounded-full" />

                        {/* Yuvarlak Zincir Bağlantı Yuvası */}
                        <div
                          onDrop={(e) => handleDrop(e, slotIndex)}
                          onDragOver={handleDragOver}
                          onClick={() => {
                            if (selectedLinkId) {
                              const item = CHAIN_LINKS.find(l => l.id === selectedLinkId);
                              if (item) handlePlaceLink(item, slotIndex);
                            }
                          }}
                          className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center p-3 text-center transition-all relative shrink-0 ${
                            placedLinkItem
                              ? 'bg-emerald-100 border-4 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-300'
                              : selectedLinkId
                              ? 'bg-blue-50 border-4 border-dashed border-blue-500 ring-4 ring-blue-300 cursor-pointer animate-pulse scale-105'
                              : 'bg-amber-50/70 border-4 border-dashed border-amber-400/90 hover:border-amber-500 hover:bg-amber-100/70 cursor-pointer shadow-inner'
                          }`}
                        >
                          {placedLinkItem ? (
                            <div className="flex flex-col items-center justify-center space-y-1">
                              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                              <p className="text-[10px] sm:text-[11px] font-bold text-emerald-950 leading-tight line-clamp-3">
                                {placedLinkItem.text}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLink(slotIndex);
                                }}
                                className="text-[10px] text-emerald-700 hover:text-emerald-950 font-bold underline mt-0.5"
                              >
                                Kaldır
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-1">
                              <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center border border-amber-300">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight text-center px-1">
                                {selectedLinkId ? 'Buraya Yerleştir' : 'Yerleştiriniz'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Sağ Zincir Bağlantı Çubuğu */}
                        <div className="w-3 sm:w-4 h-2 bg-gradient-to-r from-slate-400 to-amber-400 rounded-full" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt Alan: Yerleştirilmeyi Bekleyen Maddeler Havuzu */}
        {unplacedLinks.length > 0 && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {unplacedLinks.map((linkItem) => {
                const isSelected = selectedLinkId === linkItem.id;

                return (
                  <div
                    key={linkItem.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, linkItem)}
                    onClick={() => setSelectedLinkId(isSelected ? null : linkItem.id)}
                    className={`rounded-2xl p-4 transition-all bg-white shadow-xs cursor-grab active:cursor-grabbing select-none flex flex-col justify-between border-2 ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50/50 shadow-md scale-[1.02]'
                        : 'border-slate-200 hover:border-blue-400 hover:shadow-sm hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        <Link2 className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                        {linkItem.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Alt Geri Bildirim Şeridi (Tekrarsız ve Doğrudan Açıklama) */}
        {lastFeedback.type && unplacedLinks.length > 0 && (
          <div className="px-5 sm:px-6 pb-2">
            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition-all shadow-2xs ${
                lastFeedback.type === 'correct'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-rose-50 text-rose-950 border-rose-300'
              }`}
            >
              {lastFeedback.type === 'correct' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <p className="leading-relaxed font-semibold">
                {lastFeedback.message}
              </p>
            </div>
          </div>
        )}

        {/* Alt Gezinme Butonları */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
          {onGoToPrevTab && (
            <button
              onClick={onGoToPrevTab}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Olay Bilgi Kartlarına Dön</span>
            </button>
          )}

          <button
            onClick={onGoToSummary}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-900 hover:bg-blue-800 text-white transition-colors shadow-sm cursor-pointer"
          >
            <span>Karşılaştırmalı Analize İlerle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};



