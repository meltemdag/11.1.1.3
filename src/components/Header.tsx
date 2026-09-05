import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  completedCount: number;
}

const tabClass = (active: boolean) =>
  `px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer border ${
    active
      ? 'bg-gradient-to-b from-seal-light to-seal text-parchment-100 border-brass/60 shadow-wax'
      : 'text-brass-pale/90 border-transparent hover:text-parchment-100 hover:bg-brass/15 hover:border-brass/30'
  }`;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedCount
}) => {
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
            <span>Strateji Haritası</span>
          </button>

          <button
            onClick={() => setActiveTab('etkinlik')}
            className={`flex items-center ${tabClass(activeTab === 'etkinlik')}`}
          >
            <span>Neden - Sonuç</span>
            {completedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-brass/25 text-brass-pale border border-brass/50 rounded text-xs">
                {completedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('nedensellik')}
            className={tabClass(activeTab === 'nedensellik')}
          >
            <span>Antlaşma Kronolojisi</span>
          </button>

          <button
            onClick={() => setActiveTab('karsilastirma')}
            className={tabClass(activeTab === 'karsilastirma')}
          >
            <span>Karşılaştırmalı Analiz</span>
          </button>
        </div>
      </div>
    </header>
  );
};
