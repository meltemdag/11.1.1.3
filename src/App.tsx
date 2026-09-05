import React, { useState, useEffect } from 'react';
import { TREATIES } from './data/treaties';
import { ActiveTab, TreatyId, TreatyProgress } from './types';
import { Header } from './components/Header';
import { IntroScreen } from './components/IntroScreen';
import { MapExplorer } from './components/MapExplorer';
import { TreatyCardActivity } from './components/TreatyCardActivity';
import { CausalityChain } from './components/CausalityChain';
import { TreatyComparison } from './components/TreatyComparison';

export const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('harita');
  const [modalTreatyId, setModalTreatyId] = useState<TreatyId | null>(null);

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
  // Diplomasi zincirinin tamamlanma durumu (3. sekme kilidi için)
  const [isChainCompleted, setIsChainCompleted] = useState<boolean>(false);

  // Önceki yerel depolama verilerini temizleme ve SCORM başlatma
  useEffect(() => {
    try {
      localStorage.removeItem('osmanli_antlasmalar_ilerleme');
    } catch {
      // sessiz devam
    }

    try {
      const win = window as any;
      win.SCORM?.initialize?.();
      win.SCORM?.setStatus?.('completed');
    } catch {
      // sessiz devam
    }

    const handleUnload = () => {
      try {
        const win = window as any;
        win.SCORM?.terminate?.();
      } catch {
        // sessiz devam
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload();
    };
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

  const completedCount = TREATIES.filter(t => progress[t.id]?.completed).length;
  const isMapCompleted = completedCount === TREATIES.length;

  const handleSetActiveTab = (tab: ActiveTab) => {
    // 2. sekme (Diplomasi Zinciri) için tüm pinlerin gezilip tamamlanmış olması şartı
    if (tab === 'nedensellik' && !isMapCompleted) return;
    // 3. sekme (Karşılaştırmalı Analiz) için zincir etkinliğinin tamamlanmış olması şartı
    if (tab === 'karsilastirma' && (!isMapCompleted || !isChainCompleted)) return;
    setActiveTab(tab);
  };

  const handleReset = () => {
    setProgress(createInitialProgress());
    setIsChainCompleted(false);
    setModalTreatyId(null);
    setActiveTab('harita');
  };

  const handleRestartToHome = () => {
    setProgress(createInitialProgress());
    setIsChainCompleted(false);
    setModalTreatyId(null);
    setActiveTab('harita');
    setIsStarted(false);
  };

  const handleSelectTreatyFromMap = (id: TreatyId) => {
    setModalTreatyId(id);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {!isStarted ? (
        <IntroScreen onStart={() => setIsStarted(true)} />
      ) : (
        <div>
          <Header
            activeTab={activeTab}
            setActiveTab={handleSetActiveTab}
            completedCount={completedCount}
            isMapCompleted={isMapCompleted}
            isChainCompleted={isChainCompleted}
          />
          <main className="max-w-[1560px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5">
            {activeTab === 'harita' && (
              <MapExplorer
                progress={progress}
                onSelectTreaty={handleSelectTreatyFromMap}
                onGoToChain={() => {
                  if (isMapCompleted) {
                    setActiveTab('nedensellik');
                  }
                }}
              />
            )}

            {activeTab === 'nedensellik' && (
              <CausalityChain
                onGoToSummary={() => {
                  if (isChainCompleted) {
                    setActiveTab('karsilastirma');
                  }
                }}
                onGoToPrevTab={() => setActiveTab('harita')}
                onComplete={(completed) => setIsChainCompleted(completed)}
              />
            )}

            {activeTab === 'karsilastirma' && (
              <TreatyComparison
                progress={progress}
                onReset={handleReset}
                onRestart={handleRestartToHome}
                onGoToPrevTab={() => setActiveTab('nedensellik')}
              />
            )}
          </main>

          {/* Neden - Sonuç Modal Pop-up */}
          {modalTreatyId && (
            <TreatyCardActivity
              currentTreatyId={modalTreatyId}
              progress={progress}
              onUpdateProgress={handleUpdateProgress}
              onClose={() => setModalTreatyId(null)}
              onGoToPrevTab={() => setModalTreatyId(null)}
              onGoToNextTab={() => {
                setModalTreatyId(null);
                setActiveTab('nedensellik');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};
