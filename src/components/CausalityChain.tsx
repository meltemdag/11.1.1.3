import React, { useState, useMemo } from 'react';
import { TREATIES } from '../data/treaties';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Link2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CausalityChainProps {
  onGoToSummary?: () => void;
  onGoToPrevTab?: () => void;
}

interface ChainLinkItem {
  id: string;
  targetSlotIndex: number;
  text: string;
  hint: string;
}

const CHAIN_LINKS: ChainLinkItem[] = [
  {
    id: 'link_1',
    targetSlotIndex: 0,
    text: "Azak Kalesi'ni kaybeden devlet Karadeniz'i korumak için sefere çıktı; zaferle kale geri alınarak Karadeniz'in güvenliği yeniden sağlandı.",
    hint: "İpucu: Kaybedilen toprakları geri alma ümidinin doğduğu süreci düşününüz."
  },
  {
    id: 'link_2',
    targetSlotIndex: 1,
    text: "Kuzeydeki zaferin cesaretiyle kayıpları telafi savaşı başlatıldı; batıda yenilgi yaşansa da Karadeniz yabancı donanmalara kapalı tutuldu.",
    hint: "İpucu: Lale Devri'nin başladığı süreci düşününüz."
  },
  {
    id: 'link_3',
    targetSlotIndex: 2,
    text: "Rusya'nın Karadeniz'e inme hamlesine karşı açılan savaş kazanıldı; Rus gemileri yasaklanarak Karadeniz'in Türk gölü statüsü son kez onaylandı.",
    hint: "İpucu: XVIII. yüzyılda imzalanan son kazançlı antlaşmayı düşününüz."
  },
  {
    id: 'link_4',
    targetSlotIndex: 3,
    text: "Karadeniz yasağını kırmak isteyen Rusya ile yapılan savaş kaybedildi; Kırım'ın kaybı ve Rus donanmasıyla Türk gölü dönemi sona erdi.",
    hint: "İpucu: Şartları en ağır olan antlaşmayı düşününüz."
  }
];

export const CausalityChain: React.FC<CausalityChainProps> = () => {
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
        message: 'Doğru eşleştirme!'
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
        message: linkItem.hint
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
        {/* Açıklama ve Sıfırlama Şeridi */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-slate-700">
          <div>
            Aşağıdaki maddeleri inceleyiniz; antlaşmalar arasında Karadeniz'in statüsünün değişimini gösteren zincir halkalarını doğru sırayla yerleştiriniz.
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Zinciri Sıfırla</span>
          </button>
        </div>

        {/* Üst Alan: Yatay Zincir Halkaları Rayı (Tüm Ekran Genişliğini Dolduran Yapı) */}
        <div className="py-4 px-2 sm:px-4 bg-slate-900/5 border-b border-slate-200">
          <div className="overflow-x-auto pb-1 pt-1 scrollbar-thin">
            <div className="w-full flex items-center justify-between min-w-[800px] lg:min-w-0 px-1 sm:px-2">
              {TREATIES.map((treaty, idx) => {
                const isLast = idx === TREATIES.length - 1;
                const slotIndex = idx;
                const placedLinkId = placedLinks[slotIndex];
                const placedLinkItem = CHAIN_LINKS.find(l => l.id === placedLinkId);

                return (
                  <React.Fragment key={treaty.id}>
                    {/* Antlaşma Yuvarlak Halkası */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col items-center justify-center p-0.5 text-center border-2 border-amber-400 shadow-sm relative group transition-transform hover:scale-105 shrink-0">
                        <span className="text-[10.5px] sm:text-[11px] lg:text-xs font-black font-mono text-amber-300 leading-none">
                          {treaty.year}
                        </span>
                        <span className="text-[8px] sm:text-[8.5px] lg:text-[9.5px] font-bold text-white leading-tight mt-0.5 px-0.5 text-center">
                          {treaty.title.replace(' Antlaşması', '')}
                        </span>
                      </div>
                    </div>

                    {/* İki Antlaşma Arasındaki Bağlantı Alanı (Teması Kesinlikle Engelleyen Güvenli Ayrım) */}
                    {!isLast && (
                      <div className="flex-1 flex items-center justify-center min-w-0 px-1 sm:px-1.5 lg:px-2">
                        {/* Sol Bağlantı Çubuğu (Garantili Boşluk) */}
                        <div className="flex-1 min-w-[12px] sm:min-w-[16px] lg:min-w-[20px] h-0.5 sm:h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shrink-0" />

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
                          className={`w-[125px] h-[125px] sm:w-[145px] sm:h-[145px] md:w-[170px] md:h-[170px] lg:w-[190px] lg:h-[190px] xl:w-[210px] xl:h-[210px] rounded-full flex flex-col items-center justify-center p-2 sm:p-2.5 lg:p-3 text-center transition-all relative shrink-0 mx-1 sm:mx-1.5 ${
                            placedLinkItem
                              ? 'bg-emerald-50 border-2 sm:border-3 border-emerald-500 text-emerald-950 shadow-md ring-2 ring-emerald-300'
                              : selectedLinkId
                              ? 'bg-blue-50 border-2 sm:border-3 border-dashed border-blue-500 ring-4 ring-blue-300 cursor-pointer animate-pulse scale-102'
                              : 'bg-amber-50/70 border-2 sm:border-3 border-dashed border-amber-400/90 hover:border-amber-500 hover:bg-amber-100/70 cursor-pointer shadow-inner'
                          }`}
                          title={placedLinkItem ? placedLinkItem.text : undefined}
                        >
                          {placedLinkItem ? (
                            <div className="flex flex-col items-center justify-center space-y-1 text-center px-2 py-0.5 w-full max-w-[94%]">
                              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              </div>
                              <p className="text-[11px] sm:text-[11.5px] md:text-xs lg:text-[12.5px] xl:text-[13px] font-semibold text-emerald-950 leading-snug">
                                {placedLinkItem.text}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveLink(slotIndex);
                                }}
                                className="text-[9.5px] sm:text-[10px] text-rose-700 hover:text-rose-900 font-bold underline hover:no-underline cursor-pointer pt-0.5 shrink-0"
                                title="Bağlantıyı kaldır"
                              >
                                Kaldır
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-1 p-1 text-center">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center border border-amber-300 shadow-2xs">
                                <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              </div>
                              <span className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-tight">
                                {selectedLinkId ? 'Buraya Yerleştir' : 'Sürükle veya seç'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Sağ Bağlantı Çubuğu (Garantili Boşluk) */}
                        <div className="flex-1 min-w-[12px] sm:min-w-[16px] lg:min-w-[20px] h-0.5 sm:h-1 bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shrink-0" />
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

        {/* Alt Geri Bildirim Şeridi */}
        {lastFeedback.type && unplacedLinks.length > 0 && (
          <div className="px-5 sm:px-6 pb-4">
            <div
              className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-2xs ${
                lastFeedback.type === 'correct'
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold'
                  : 'bg-rose-50 text-rose-950 border-rose-300 font-medium'
              }`}
            >
              {lastFeedback.type === 'correct' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <p className="leading-snug">
                {lastFeedback.message}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};



