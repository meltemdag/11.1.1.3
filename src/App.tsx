import React, { useState, useEffect } from 'react';
import { TREATIES } from './data/treaties';
import { ActiveTab, TreatyId, TreatyProgress } from './types';
import { Header } from './components/Header';
import { MapExplorer } from './components/MapExplorer';
import { TreatyCardActivity } from './components/TreatyCardActivity';
import { CausalityChain } from './components/CausalityChain';
import { TreatyComparison } from './components/TreatyComparison';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('harita');
  const [currentTreatyId, setCurrentTreatyId] = useState<TreatyId>('karlofca');

  // İlerleme durumunu sıfırdan başlatan yardımcı fonksiyon
  const createInitialProgress = (): TreatyProgress => {
    const initial: TreatyProgress = {};
    TREATIES.forEach(t => {
      initial[t.id] = {
        completed: false,
        causesPlaced: [],
        effectsPlaced: [],
        attempts: 0
      };
    });
    return initial;
  };

  // İlerleme yalnızca oturum/sayfa bazlıdır (localStorage kullanılmaz)
  const [progress, setProgress] = useState<TreatyProgress>(createInitialProgress);

  // Önceki yerel depolama verilerini temizleme
  useEffect(() => {
    try {
      localStorage.removeItem('osmanli_antlasmalar_ilerleme');
    } catch {
      // sessiz devam
    }
  }, []);

  const handleUpdateProgress = (
    id: TreatyId,
    causes: string[],
    effects: string[],
    isCompleted: boolean
  ) => {
    setProgress(prev => ({
      ...prev,
      [id]: {
        completed: isCompleted,
        causesPlaced: causes,
        effectsPlaced: effects,
        attempts: (prev[id]?.attempts || 0) + 1
      }
    }));
  };

  const handleReset = () => {
    setProgress(createInitialProgress());
    setCurrentTreatyId('karlofca');
    setActiveTab('harita');
  };

  const handleSelectTreatyFromMap = (id: TreatyId) => {
    setCurrentTreatyId(id);
    setActiveTab('etkinlik');
  };

  const completedCount = TREATIES.filter(t => progress[t.id]?.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          completedCount={completedCount}
        />
        <main className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
          {activeTab === 'harita' && (
            <MapExplorer
              progress={progress}
              onSelectTreaty={handleSelectTreatyFromMap}
              onGoToChain={() => setActiveTab('nedensellik')}
            />
          )}

          {activeTab === 'etkinlik' && (
            <TreatyCardActivity
              currentTreatyId={currentTreatyId}
              onSelectTreaty={(id) => setCurrentTreatyId(id)}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onGoToNextTab={() => setActiveTab('nedensellik')}
              onGoToPrevTab={() => setActiveTab('harita')}
            />
          )}

          {activeTab === 'nedensellik' && (
            <CausalityChain
              onGoToSummary={() => setActiveTab('karsilastirma')}
              onGoToPrevTab={() => setActiveTab('etkinlik')}
            />
          )}

          {activeTab === 'karsilastirma' && (
            <TreatyComparison
              progress={progress}
              onReset={handleReset}
              onGoToPrevTab={() => setActiveTab('nedensellik')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
