export interface PrintJob {
  id: string;
  name: string;
  width: number; // in inches
  height: number; // in inches
  bleed: number; // in inches
  // Note: We removed the 'safeMargin' property as Canva's native warnings are sufficient.
}

export const PRINT_JOBS: PrintJob[] = [
  { 
    id: "biz_card_us", 
    name: "Business Card (US)", 
    width: 3.5, 
    height: 2, 
    bleed: 0.125 
  },
  { 
    id: "biz_card_eu", 
    name: "Business Card (EU)", 
    width: 3.346, // 85mm
    height: 2.165, // 55mm
    bleed: 0.118 // 3mm
  },
  { 
    id: "flyer_us", 
    name: "Flyer (Letter 8.5x11)", 
    width: 8.5, 
    height: 11, 
    bleed: 0.125 
  },
  { 
    id: "poster_large", 
    name: "Large Poster (18x24)", 
    width: 18, 
    height: 24, 
    bleed: 0.125 
  }
];