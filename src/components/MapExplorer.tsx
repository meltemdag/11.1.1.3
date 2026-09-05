import React, { useState } from 'react';
import { TREATIES } from '../data/treaties';
import { TreatyId, TreatyProgress } from '../types';
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Users, Building2, FileText, Bookmark } from 'lucide-react';

interface MapExplorerProps {
  progress: TreatyProgress;
  onSelectTreaty: (id: TreatyId) => void;
  onGoToChain?: () => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ progress, onSelectTreaty }) => {
  const [selectedId, setSelectedId] = useState<TreatyId>('karlofca');
  const [hoveredId, setHoveredId] = useState<TreatyId | null>(null);
  const selectedTreaty = TREATIES.find(t => t.id === selectedId) || TREATIES[0];

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
    <div>
      {/* Harita ve Detay Bölümü */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* İnteraktif Harita Alanı (Genişletilmiş) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] bg-slate-100 select-none overflow-hidden group">
            {/* Arka plan harita görseli */}
            <img
              src="./harita.png"
              alt="17-18. Yüzyıl Osmanlı Haritası"
              className="w-full h-full object-cover object-center"
            />

            {/* Antlaşma Pinleri */}
            {TREATIES.map((treaty) => {
              const isSelected = treaty.id === selectedId;
              const isHovered = treaty.id === hoveredId;
              const isCompleted = progress[treaty.id]?.completed;

              return (
                <button
                  key={treaty.id}
                  onClick={() => setSelectedId(treaty.id)}
                  onMouseEnter={() => setHoveredId(treaty.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    left: `${treaty.mapCoords.x}%`,
                    top: `${treaty.mapCoords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group/pin focus:outline-none transition-transform cursor-pointer ${
                    isSelected ? 'scale-110 z-30' : isHovered ? 'scale-110 z-40' : 'hover:scale-110 hover:z-40 z-20'
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

                  {/* Etiket (Tıklandığında veya Mouse ile Üzerine Gelindiğinde Görünür) */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium shadow-md pointer-events-none z-50 transition-all duration-150 ${
                      isSelected
                        ? 'bg-slate-900/95 text-amber-300 border border-amber-500/50 opacity-100 visible scale-100'
                        : isHovered
                        ? 'bg-slate-900/95 text-white border border-slate-700/80 opacity-100 visible scale-100'
                        : 'bg-slate-900/95 text-white border border-slate-700/80 opacity-0 invisible scale-95 group-hover/pin:opacity-100 group-hover/pin:visible group-hover/pin:scale-100'
                    } ${
                      treaty.id === 'belgrad' || treaty.id === 'pasarofca' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                    }`}
                  >
                    {treaty.title} ({treaty.year})
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Seçili Antlaşmanın Özet Kartı (Şık Diplomatik Künye Kartı) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
          {/* Üst Şık Vurgu Çizgisi */}
          <div className="h-1.5 bg-gradient-to-r from-amber-600 via-blue-900 to-indigo-900 w-full" />

          <div className="p-4 sm:p-5 space-y-3">
            {/* Kart Üst Başlık */}
            <div className="border-b border-slate-100 pb-2.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {selectedTreaty.title}
                </h2>
                {progress[selectedTreaty.id]?.completed && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-medium text-slate-600">{selectedTreaty.locationName}</span>
              </div>
            </div>

            {/* Bilgi Blokları */}
            <div className="space-y-2.5 text-xs">
              {/* Padişah ve Sadrazam Künyesi (İkili Kart) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80 hover:border-slate-300 transition-colors shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Building2 className="w-3 h-3" />
                    </div>
                    <span>Padişah</span>
                  </div>
                  <div className="font-serif font-bold text-slate-900 text-xs sm:text-sm mt-1 truncate" title={selectedTreaty.sultan}>
                    {selectedTreaty.sultan}
                  </div>
                </div>

                <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/80 hover:border-slate-300 transition-colors shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                    <span>Sadrazam</span>
                  </div>
                  <div className="font-medium text-slate-800 text-xs sm:text-[13px] mt-1 truncate" title={selectedTreaty.sadrazam}>
                    {selectedTreaty.sadrazam}
                  </div>
                </div>
              </div>

              {/* Taraflar */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Taraflar:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTreaty.parties.map((party, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs font-medium"
                    >
                      {party}
                    </span>
                  ))}
                </div>
              </div>

              {/* Döneme Dair */}
              <div className="bg-[#FAF8F5] rounded-xl p-2.5 border border-amber-900/10 border-l-4 border-l-amber-600 shadow-2xs space-y-1">
                <div className="text-[11px] font-bold text-amber-900/90 uppercase tracking-wider">
                  Döneme Dair:
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {selectedTreaty.contextNote}
                </p>
              </div>

              {/* Önemli Maddesi */}
              <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-slate-50 rounded-xl p-3 border border-blue-200/90 shadow-2xs space-y-1 relative">
                <div className="text-blue-950 font-bold flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                  <span>Önemli Maddesi:</span>
                </div>
                <p className="text-blue-950 leading-relaxed text-xs font-medium italic pt-0.5">
                  "{selectedTreaty.criticalProvision}"
                </p>
              </div>

              {/* Akılda Kalsın */}
              <div className="bg-gradient-to-br from-amber-50/90 via-amber-100/30 to-orange-50/40 rounded-xl p-3 border border-amber-300/80 shadow-2xs space-y-1 relative">
                <div className="text-amber-950 font-bold flex items-center gap-1.5 text-xs">
                  <Bookmark className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>Akılda Kalsın:</span>
                </div>
                <p className="text-amber-950 leading-relaxed text-xs font-medium pt-0.5">
                  {selectedTreaty.memoryTip}
                </p>
              </div>
            </div>

            {/* Alt Kontroller: Eylem ve Gezinme Butonları (Akılda Kalsın Kartına Yaklaştırılmış) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {/* Olay Bilgi Kartına Git Butonu */}
              <button
                onClick={() => onSelectTreaty(selectedTreaty.id)}
                className="w-full group flex items-center justify-between py-2.5 px-3.5 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 hover:from-blue-900 hover:via-indigo-900 hover:to-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer border border-amber-400/30"
              >
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                    {getTreatyQuestion(selectedTreaty.id)}
                  </div>
                  <div className="text-[11px] text-slate-300 font-normal">
                    Neden ve sonuçları tasnif et
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 flex items-center justify-center transition-all shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
