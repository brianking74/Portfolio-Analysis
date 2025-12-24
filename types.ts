
export enum BarrierType {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}

export interface RawPrincipalData {
  name: string;
  margin: number;
  revenue: number;
  creditTerms: string;
  barrier: BarrierType;
}

export interface ProcessedPrincipalData extends RawPrincipalData {
  xAxisValue: number; // Numeric mapping for credit terms
  bubbleSize: number; // Scaled value for the chart
}

export const CREDIT_ORDER = ['30', '30+', '45', '60', '60+', '90', '120', '180', 'COD', 'PIA'];

export const BARRIER_COLORS = {
  [BarrierType.EASY]: '#10b981',   // Emerald 500
  [BarrierType.MEDIUM]: '#f59e0b', // Amber 500
  [BarrierType.HARD]: '#ef4444'    // Red 500
};

export const BARRIER_LABELS = {
  [BarrierType.EASY]: 'Easy',
  [BarrierType.MEDIUM]: 'Medium',
  [BarrierType.HARD]: 'Hard'
};
