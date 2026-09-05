export type TreatyId = 'karlofca' | 'prut' | 'pasarofca' | 'belgrad' | 'kucuk_kaynarca';

export type ItemType = 'cause' | 'effect';

export interface TreatyItem {
  id: string;
  text: string;
  type: ItemType;
  explanation: string; // Neden doğru sınıflandırma olduğuna dair pedagojik açıklama
}

export interface CausalityConnection {
  fromTreatyId: TreatyId;
  toTreatyId: TreatyId;
  previousConsequence: string;
  nextCause: string;
  transitionNote: string;
}

export interface Treaty {
  id: TreatyId;
  title: string;
  year: number;
  dateStr: string;
  sultan: string;
  sadrazam: string;
  parties: string[];
  locationName: string;
  mapCoords: {
    x: number; // Yüzdelik konum (sol % bazında)
    y: number; // Yüzdelik konum (üst % bazında)
  };
  contextNote: string;
  criticalProvision: string;
  memoryTip: string;
  items: TreatyItem[];
  keyHighlight: string;
}

export interface TreatyProgress {
  [key: string]: {
    completed: boolean;
    causesPlaced: string[];
    effectsPlaced: string[];
    attempts: number;
  };
}

export type ActiveTab = 'harita' | 'nedensellik' | 'karsilastirma';
