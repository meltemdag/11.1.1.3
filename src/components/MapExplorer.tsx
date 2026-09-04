import React, { useState } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyId, TreatyProgress } from '../types';
import { MapPin, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Users, Building2, FileText, Bookmark } from 'lucide-react';

interface MapExplorerProps {
  progress: TreatyProgress;
  onSelectTreaty: (id: TreatyId) => void;
  onGoToChain?: () => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ progress, onSelectTreaty, onGoToChain }) => {
  const [selectedId, setSelectedId] = useState<TreatyId>('karlofca');
  const selectedTreaty = TREATIES.find(t => t.id === selectedId) || TREATIES[0];

  const currentIndex = TREATIES.findIndex(t => t.id === selectedId);
  const prevTreaty = TREATIES[currentIndex - 1];
  const nextTreaty = TREATIES[currentIndex + 1];
  const allCompleted = TREATIES.every(t => progress[t.id]?.completed);

  const getTreatyQuestion = (id: TreatyId) => {
    switch (id) {
      case 'karlofca':
        return "Karlofça'da Ne Oldu?";
      case 'prut':
        return "Prut'ta Ne Oldu?";
      case 'pasarofca':
        return "Pasarofça'da Ne Oldu?";
      case 'belgrad':
        return "Belgrad'da Ne Oldu?";
      case 'kucuk_kaynarca':
        return "Küçük Kaynarca'da Ne Oldu?";
      default:
        return "Karlofça'da Ne Oldu?";
    }
  };

  return (
    <div className="space-y-3">
      {/* Nedensellik Zinciri Hızlı Erişim Şeridi */}
      {onGoToChain && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-amber-400/30">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block">
                {allCompleted ? 'Tüm Antlaşma Noktaları Tamamlandı!' : 'Nedensellik Zinciri Etkinliği'}
              </span>
              <span className="text-slate-300 text-xs">
                Antlaşmalar arası kronolojik ve nedensel halkaları kurmak için doğrudan zincir sayfasına geçebilirsiniz.
              </span>
            </div>
          </div>
          <button
            onClick={onGoToChain}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
          >
            <span>Nedensellik Zincirine İlerle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Harita ve Detay Bölümü */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* İnteraktif Harita Alanı (Genişletilmiş) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] bg-slate-100 select-none overflow-hidden group">
            {/* Arka plan harita görseli */}
            <img
              src="./harita.png"
              alt="17-18. Yüzyıl Osmanlı Haritası"
              className="w-full h-full object-cover object-center"
            />

            {/* Antlaşma Pinleri */}
            {TREATIES.map((treaty) => {
              const isSelected = treaty.id === selectedId;
              const isCompleted = progress[treaty.id]?.completed;

              return (
                <button
                  key={treaty.id}
                  onClick={() => setSelectedId(treaty.id)}
                  style={{
                    left: `${treaty.mapCoords.x}%`,
                    top: `${treaty.mapCoords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin focus:outline-none transition-transform ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-110'
                  }`}
                  aria-label={`${treaty.title} durağı`}
                >
                  {/* Nabız Halka Efekti */}
                  <span
                    className={`absolute -inset-1.5 rounded-full opacity-75 animate-ping-slow ${
                      isSelected ? 'bg-amber-400' : isCompleted ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}
                  />

                  {/* Pin Gövdesi */}
                  <div
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-md border-2 text-white font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-amber-600 border-white ring-2 ring-amber-400'
                        : isCompleted
                        ? 'bg-emerald-600 border-white'
                        : 'bg-blue-900 border-white hover:bg-blue-800'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>

                  {/* Etiket (Yalnızca Seçildiğinde / Tıklandığında Görünür) */}
                  {isSelected && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-white/95 text-slate-800 border border-slate-200/90 text-[11px] font-medium shadow-xs pointer-events-none z-40 ${
                        treaty.id === 'belgrad' || treaty.id === 'pasarofca' ? 'bottom-full mb-1' : 'top-full mt-1'
                      }`}
                    >
                      {treaty.title} ({treaty.year})
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seçili Antlaşmanın Özet Kartı */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#FAF8F5] rounded-xl border border-amber-900/10 p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Kart Üst Başlık & Tarih */}
            <div className="border-b border-amber-900/10 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-800 bg-white px-2.5 py-0.5 rounded border border-amber-200/80 shadow-2xs">
                  {selectedTreaty.dateStr}
                </span>
                {progress[selectedTreaty.id]?.completed && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 tracking-tight">
                {selectedTreaty.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{selectedTreaty.locationName}</span>
              </div>
            </div>

            {/* Bilgi Blokları */}
            <div className="space-y-3 text-xs">
              {/* Padişah ve Sadrazam */}
              <div className="bg-white/90 p-3 rounded-lg border border-amber-900/10 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Dönemin Padişahı:
                  </span>
                  <span className="font-bold text-slate-900">{selectedTreaty.sultan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Sadrazamı:
                  </span>
                  <span className="font-semibold text-slate-800">{selectedTreaty.sadrazam}</span>
                </div>
              </div>

              {/* Taraflar */}
              <div>
                <div className="text-slate-500 mb-1.5 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> Taraflar:
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTreaty.parties.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-white text-slate-700 rounded text-[11px] font-medium border border-amber-900/10 shadow-2xs"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Döneme Dair */}
              <div className="border-t border-amber-900/10 pt-2.5">
                <div className="text-slate-500 font-semibold mb-1">Döneme Dair:</div>
                <p className="text-slate-700 leading-relaxed text-[11.5px]">
                  {selectedTreaty.contextNote}
                </p>
              </div>

              {/* Kritik Madde (Mavi Vurgulu) */}
              <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200/80 space-y-1">
                <div className="text-blue-900 font-bold flex items-center gap-1.5 text-[11.5px]">
                  <FileText className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                  <span>Önemli Maddesi:</span>
                </div>
                <p className="text-blue-950 leading-relaxed text-[11.5px]">
                  {selectedTreaty.criticalProvision}
                </p>
              </div>

              {/* Akılda Kalsın / Temel Çıkarım (Tek Kart) */}
              <div className="bg-amber-50/80 p-3 rounded-lg border border-amber-200/90 space-y-1">
                <div className="text-amber-900 font-bold flex items-center gap-1.5 text-[11.5px]">
                  <Bookmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Akılda Kalsın:</span>
                </div>
                <p className="text-amber-950 leading-relaxed text-[11.5px]">
                  {selectedTreaty.memoryTip}
                </p>
              </div>
            </div>
          </div>

          {/* Gezinme ve Olay Bilgi Kartına Git Butonları */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => onSelectTreaty(selectedTreaty.id)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all"
            >
              <span>{getTreatyQuestion(selectedTreaty.id)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => prevTreaty && setSelectedId(prevTreaty.id)}
                disabled={!prevTreaty}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  prevTreaty
                    ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Önceki Antlaşma</span>
              </button>

              <button
                onClick={() => nextTreaty && setSelectedId(nextTreaty.id)}
                disabled={!nextTreaty}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  nextTreaty
                    ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                    : 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                }`}
              >
                <span>Sonraki Antlaşma</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
