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
        {/* İnteraktif Harita Alanı (Genişletilmiş) — eski kâşife ait çerçeveli harita */}
        <div className="lg:col-span-7 xl:col-span-8 parchment-surface rounded-2xl border-2 border-parchment-400/70 overflow-hidden shadow-parchment">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] bg-parchment-300 select-none overflow-hidden group">
            {/* Arka plan harita görseli */}
            <img
              src="./harita.png"
              alt="XVII-XVIII. Yüzyıl Osmanlı Haritası"
              className="w-full h-full object-cover object-center sepia-[0.35] contrast-[0.95] saturate-[0.85]"
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
                      isSelected ? 'bg-seal-light' : isCompleted ? 'bg-olive-seal' : 'bg-brass-light'
                    }`}
                  />

                  {/* Pin Gövdesi (balmumu mühür) */}
                  <div
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-wax border-2 text-parchment-100 font-bold text-xs transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-b from-seal-light to-seal-dark border-brass-pale ring-2 ring-brass-light'
                        : isCompleted
                        ? 'bg-olive-seal border-parchment-100'
                        : 'bg-ink border-parchment-200 hover:bg-ink-light'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-parchment-100" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-parchment-100" />
                    )}
                  </div>

                  {/* Etiket (Tıklandığında veya Mouse ile Üzerine Gelindiğinde Görünür) */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium shadow-parchment pointer-events-none z-50 transition-all duration-150 border ${
                      isSelected
                        ? 'bg-ink/95 text-brass-pale border-brass/60 opacity-100 visible scale-100'
                        : isHovered
                        ? 'bg-ink/95 text-parchment-100 border-brass/40 opacity-100 visible scale-100'
                        : 'bg-ink/95 text-parchment-100 border-brass/40 opacity-0 invisible scale-95 group-hover/pin:opacity-100 group-hover/pin:visible group-hover/pin:scale-100'
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

        {/* Seçili Antlaşmanın Özet Kartı (Diplomatik Künye — berat/kadi kâğıdı görünümü) */}
        <div className="lg:col-span-5 xl:col-span-4 parchment-surface rounded-2xl border-2 border-parchment-400/70 shadow-parchment overflow-hidden flex flex-col">
          {/* Üst Yaldız Vurgu Çizgisi */}
          <div className="h-1.5 bg-gradient-to-r from-seal-dark via-brass to-seal-dark w-full" />

          <div className="p-4 sm:p-5 space-y-3">
            {/* Kart Üst Başlık */}
            <div className="border-b border-parchment-400/60 pb-2.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-antique text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-snug">
                  {selectedTreaty.title}
                </h2>
                {progress[selectedTreaty.id]?.completed && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-olive-seal bg-[#eef0da] px-2.5 py-1 rounded-full border border-olive-seal/40 shadow-2xs shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-1">
                <MapPin className="w-3.5 h-3.5 text-brass shrink-0" />
                <span className="font-medium text-ink-light">{selectedTreaty.locationName}</span>
              </div>
            </div>

            {/* Bilgi Blokları */}
            <div className="space-y-2.5 text-xs">
              {/* Padişah ve Sadrazam Künyesi (İkili Kart) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="parchment-deep rounded-xl p-2.5 border border-parchment-400/60 hover:border-brass/50 transition-colors shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft uppercase tracking-wider">
                    <div className="w-5 h-5 rounded-full bg-brass/20 text-brass border border-brass/40 flex items-center justify-center shrink-0">
                      <Building2 className="w-3 h-3" />
                    </div>
                    <span>Padişah</span>
                  </div>
                  <div className="font-antique font-bold text-ink text-xs sm:text-sm mt-1 truncate" title={selectedTreaty.sultan}>
                    {selectedTreaty.sultan}
                  </div>
                </div>

                <div className="parchment-deep rounded-xl p-2.5 border border-parchment-400/60 hover:border-brass/50 transition-colors shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft uppercase tracking-wider">
                    <div className="w-5 h-5 rounded-full bg-seal/15 text-seal border border-seal/35 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                    <span>Sadrazam</span>
                  </div>
                  <div className="font-medium text-ink-light text-xs sm:text-[13px] mt-1 truncate" title={selectedTreaty.sadrazam}>
                    {selectedTreaty.sadrazam}
                  </div>
                </div>
              </div>

              {/* Taraflar */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-light">
                  <Users className="w-3.5 h-3.5 text-brass" />
                  <span>Taraflar:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTreaty.parties.map((party, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[11px] parchment-deep text-ink-light border border-parchment-400/70 shadow-2xs font-medium"
                    >
                      {party}
                    </span>
                  ))}
                </div>
              </div>

              {/* Döneme Dair */}
              <div className="parchment-deep rounded-xl p-2.5 border border-brass/40 border-l-4 border-l-brass shadow-2xs space-y-1">
                <div className="text-[11px] font-bold text-brass uppercase tracking-wider">
                  Döneme Dair:
                </div>
                <p className="text-ink leading-relaxed text-xs">
                  {selectedTreaty.contextNote}
                </p>
              </div>

              {/* Önemli Maddesi */}
              <div className="parchment-deep rounded-xl p-3 border border-seal/35 shadow-2xs space-y-1 relative">
                <div className="text-seal-dark font-bold flex items-center gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-seal shrink-0" />
                  <span>Önemli Maddesi:</span>
                </div>
                <p className="text-ink leading-relaxed text-xs font-medium italic pt-0.5">
                  "{selectedTreaty.criticalProvision}"
                </p>
              </div>

              {/* Akılda Kalsın */}
              <div className="parchment-deep rounded-xl p-3 border border-brass/50 shadow-2xs space-y-1 relative">
                <div className="text-ink font-bold flex items-center gap-1.5 text-xs">
                  <Bookmark className="w-3.5 h-3.5 text-brass shrink-0" />
                  <span>Akılda Kalsın:</span>
                </div>
                <p className="text-ink leading-relaxed text-xs font-medium pt-0.5">
                  {selectedTreaty.memoryTip}
                </p>
              </div>
            </div>

            {/* Alt Kontroller: Eylem ve Gezinme Butonları (Akılda Kalsın Kartına Yaklaştırılmış) */}
            <div className="pt-2 border-t border-parchment-400/60 space-y-2">
              {/* Olay Bilgi Kartına Git Butonu */}
              <button
                onClick={() => onSelectTreaty(selectedTreaty.id)}
                className="w-full group flex items-center justify-between py-2.5 px-3.5 bg-gradient-to-r from-ink via-ink-light to-ink hover:from-ink-light hover:via-ink hover:to-ink-light text-parchment-100 rounded-xl text-xs sm:text-sm font-semibold shadow-wax hover:shadow-parchment transition-all cursor-pointer border border-brass/50"
              >
                <div className="text-left">
                  <div className="font-antique font-bold text-parchment-50 group-hover:text-brass-pale transition-colors">
                    {getTreatyQuestion(selectedTreaty.id)}
                  </div>
                  <div className="text-[11px] text-parchment-300/80 font-normal">
                    Neden ve sonuçları tasnif et
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-parchment-100/10 group-hover:bg-brass group-hover:text-ink flex items-center justify-center transition-all shrink-0">
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
