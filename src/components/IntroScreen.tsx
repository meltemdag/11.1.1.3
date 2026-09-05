import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center py-8 px-3 sm:px-6 overflow-hidden">
      {/* Tarihî Arka Plan: Osmanlı Haritası, Ahidname-i Hümayun ve Pusula Görseli */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.02] filter contrast-[1.08] brightness-[0.82]"
        style={{ backgroundImage: "url('./giris-arka-plan.webp')" }}
      />
      
      {/* Sıcak Parşömen ve Sinematik Atmosfer Katmanı */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2b1b0d]/75 via-[#1d1208]/65 to-[#150c05]/85 backdrop-blur-[1.5px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,220,186,0.18)_0%,rgba(18,11,5,0.75)_100%)]" />

      {/* Dış Çerçeve (Tarihî Ferman / Antlaşma Cildi Bordürü) */}
      <div className="relative z-10 w-full max-w-3xl lg:max-w-[820px] p-2 sm:p-2.5 rounded-3xl bg-gradient-to-b from-[#dfceaa]/95 via-[#d6c194]/95 to-[#dfceaa]/95 border-2 border-brass/80 shadow-[0_16px_50px_rgba(0,0,0,0.65)] animate-fade-in">
        
        {/* İç Parşömen Alanı */}
        <div className="relative parchment-surface rounded-2xl border border-brass/60 p-6 sm:p-10 md:p-12 space-y-7 overflow-hidden text-center shadow-inner">
          
          {/* Köşe Tezhip / Cetvel Motifleri */}
          <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-brass/90 pointer-events-none rounded-tl-xs" />
          <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-brass/90 pointer-events-none rounded-tr-xs" />
          <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-brass/90 pointer-events-none rounded-bl-xs" />
          <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-brass/90 pointer-events-none rounded-br-xs" />

          {/* Başlık Alanı (Döneme Uygun, Dikkat Çekici Tipografi) */}
          <div className="space-y-2.5 pt-1">
            {/* Dönem İbaresi */}
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-brass/80" />
              <span className="font-seal text-xs sm:text-sm tracking-[0.28em] text-brass-dark font-extrabold uppercase">
                1699 — 1774
              </span>
              <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-brass/80" />
            </div>

            {/* İki Katmanlı Şık Başlık */}
            <h1 className="font-antique tracking-tight leading-tight">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-serif text-ink-light italic font-normal tracking-normal">
                Karlofça'dan Küçük Kaynarca'ya
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-ink via-seal-dark to-ink bg-clip-text text-transparent mt-1 uppercase tracking-wider">
                Osmanlı Diplomasisi
              </span>
            </h1>

            {/* Tarihî Cetvel / Yıldız Süsü */}
            <div className="flex items-center justify-center gap-2 py-1 opacity-80">
              <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-brass" />
              <svg className="w-3.5 h-3.5 text-brass" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
              <span className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-brass" />
            </div>
          </div>

          {/* Açıklama / Yönlendirme Metni */}
          <div className="relative parchment-deep rounded-xl p-5 sm:p-6 border border-parchment-400/80 shadow-2xs">
            <p className="text-sm sm:text-base text-ink-light leading-relaxed font-serif">
              1699-1774 yılları arasındaki Osmanlı antlaşmalarını harita üzerinde inceleyiniz; neden-sonuç bağlantılarını kurarak dönemin diplomatik sürecini ve değişen güç dengelerini değerlendiriniz.
            </p>
          </div>

          {/* Başlat Butonu (Mühür & Pirinç Zarafeti) */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={onStart}
              className="px-10 py-3.5 bg-gradient-to-r from-ink via-seal-dark to-ink hover:from-seal-dark hover:via-ink hover:to-seal-dark text-parchment-100 rounded-xl text-sm sm:text-base font-bold shadow-wax hover:shadow-parchment transition-all cursor-pointer border border-brass/70 tracking-wide"
            >
              <span>Etkinliğe Başla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
