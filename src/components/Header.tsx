import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  completedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  completedCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Navigasyon Sekmeleri */}
      <div className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center py-2">
        <div className="flex overflow-x-auto space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('harita')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'harita'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Strateji Haritası</span>
          </button>

          <button
            onClick={() => setActiveTab('etkinlik')}
            className={`flex items-center px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'etkinlik'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Neden - Sonuç</span>
            {completedCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-blue-800 text-blue-100 rounded text-xs">
                {completedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('nedensellik')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'nedensellik'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Antlaşma Kronolojisi</span>
          </button>

          <button
            onClick={() => setActiveTab('karsilastirma')}
            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'karsilastirma'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Karşılaştırmalı Analiz</span>
          </button>
        </div>
      </div>
    </header>
  );
};
