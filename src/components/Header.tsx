import React, { useEffect, useState } from 'react';
import { ActiveTab } from '../types';
import { Maximize2, Minimize2, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  completedCount?: number;
  isMapCompleted?: boolean;
  isChainCompleted?: boolean;
}

const tabClass = (active: boolean) =>
  `px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
    active
      ? 'bg-gradient-to-b from-seal-light to-seal text-parchment-100 border-brass/60 shadow-wax'
      : 'text-brass-pale/90 border-transparent hover:text-parchment-100 hover:bg-brass/15 hover:border-brass/30'
  }`;

const lockedTabClass =
  'px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors border border-brass/20 text-brass-pale/45 bg-black/25 cursor-not-allowed flex items-center gap-1.5 select-none opacity-60';

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMapCompleted = false,
  isChainCompleted = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    () => typeof document !== 'undefined' && !!document.fullscreenElement
  );

  // Tam ekran durumunu izle (F11 veya sistem yollarıyla çıkılması dahil)
  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // sessiz hata yönetimi
      });
    } else {
      document.documentElement.requestFullscreen().catch(() => {
        // sessiz hata yönetimi
      });
    }
  };

  return (
    <header className="leather-surface sticky top-0 z-40 shadow-parchment-lg border-b-2 border-brass/70">
      {/* Altın çift çizgi süsü (deri cildin pirinç frenk çivisi bandı) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-brass/20 via-brass-light to-brass/20" />

      {/* Navigasyon Sekmeleri */}
      <div className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center py-2">
        <div className="flex overflow-x-auto space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('harita')}
            className={tabClass(activeTab === 'harita')}
          >
            <span>Diplomasi Haritası</span>
          </button>

          <button
            onClick={() => isMapCompleted && setActiveTab('nedensellik')}
            disabled={!isMapCompleted}
            title={!isMapCompleted ? 'Önce haritadaki tüm antlaşmaların neden ve sonuçlarını tamamlayınız.' : undefined}
            className={!isMapCompleted ? lockedTabClass : tabClass(activeTab === 'nedensellik')}
          >
            {!isMapCompleted && <Lock className="w-3.5 h-3.5 text-brass/60 shrink-0" />}
            <span>Diplomasi Zinciri</span>
          </button>

          <button
            onClick={() => isChainCompleted && setActiveTab('karsilastirma')}
            disabled={!isChainCompleted}
            title={!isChainCompleted ? 'Önce Diplomasi Zinciri etkinliğini tamamlayınız.' : undefined}
            className={!isChainCompleted ? lockedTabClass : tabClass(activeTab === 'karsilastirma')}
          >
            {!isChainCompleted && <Lock className="w-3.5 h-3.5 text-brass/60 shrink-0" />}
            <span>Karşılaştırmalı Analiz</span>
          </button>
        </div>

        {/* Tam Ekran Aç/Kapa (yalnızca ikon) */}
        <button
          onClick={handleToggleFullscreen}
          title={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
          aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
          className="ml-auto shrink-0 w-8 h-8 flex items-center justify-center rounded-md text-brass-pale border border-brass/40 bg-brass/10 hover:bg-brass/25 hover:text-parchment-50 transition-colors cursor-pointer"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
