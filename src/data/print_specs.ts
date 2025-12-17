/**
 * Print Job Specifications
 * Comprehensive presets for commercial printing with DPI guidelines
 * Based on 8+ years of prepress experience
 */

export interface PrintJob {
  id: string;
  name: string;
  category: "small" | "standard" | "large" | "xlarge";
  width: number; // in inches
  height: number; // in inches
  bleed: number; // in inches
  safeMargin: number; // in inches - keep text/logos inside this
  minDPI: number; // minimum acceptable
  recommendedDPI: number; // ideal quality
  viewingDistance: string; // typical viewing distance
  notes: string; // prepress tips
}

export const PRINT_CATEGORIES = {
  small: {
    name: "Small Format",
    description: "Business cards, postcards, stickers",
    icon: "📇",
  },
  standard: {
    name: "Standard Print",
    description: "Flyers, brochures, booklets",
    icon: "📄",
  },
  large: {
    name: "Large Format",
    description: "Posters, banners, signage",
    icon: "🖼️",
  },
  xlarge: {
    name: "Extra Large Format",
    description: "Vinyl banners, billboards, wraps",
    icon: "🏗️",
  },
} as const;

export const PRINT_JOBS: PrintJob[] = [
  // SMALL FORMAT
  {
    id: "biz_card_us",
    name: "Business Card (US)",
    category: "small",
    width: 3.5,
    height: 2,
    bleed: 0.125,
    safeMargin: 0.125,
    minDPI: 300,
    recommendedDPI: 350,
    viewingDistance: "6-12 inches",
    notes: "Held in hand, needs crisp text and details. Consider 350+ DPI for fine lines.",
  },
  {
    id: "biz_card_eu",
    name: "Business Card (EU)",
    category: "small",
    width: 3.346, // 85mm
    height: 2.165, // 55mm
    bleed: 0.118, // 3mm
    safeMargin: 0.118,
    minDPI: 300,
    recommendedDPI: 350,
    viewingDistance: "6-12 inches",
    notes: "Standard European size. Same high-quality requirements as US cards.",
  },
  {
    id: "postcard_4x6",
    name: "Postcard (4x6)",
    category: "small",
    width: 6,
    height: 4,
    bleed: 0.125,
    safeMargin: 0.25,
    minDPI: 300,
    recommendedDPI: 300,
    viewingDistance: "12-18 inches",
    notes: "USPS standard postcard size. Keep address area on right side if mailing.",
  },
  {
    id: "rack_card",
    name: "Rack Card (4x9)",
    category: "small",
    width: 4,
    height: 9,
    bleed: 0.125,
    safeMargin: 0.25,
    minDPI: 300,
    recommendedDPI: 300,
    viewingDistance: "12-24 inches",
    notes: "Standard display rack size. Bold headlines work best for quick scanning.",
  },

  // STANDARD FORMAT
  {
    id: "flyer_letter",
    name: "Flyer (Letter 8.5x11)",
    category: "standard",
    width: 8.5,
    height: 11,
    bleed: 0.125,
    safeMargin: 0.25,
    minDPI: 300,
    recommendedDPI: 300,
    viewingDistance: "12-24 inches",
    notes: "Most common print size. Works for handouts, wall postings, and mailers.",
  },
  {
    id: "flyer_a4",
    name: "Flyer (A4)",
    category: "standard",
    width: 8.27, // 210mm
    height: 11.69, // 297mm
    bleed: 0.118, // 3mm
    safeMargin: 0.25,
    minDPI: 300,
    recommendedDPI: 300,
    viewingDistance: "12-24 inches",
    notes: "International standard. Slightly narrower and taller than US Letter.",
  },
  {
    id: "brochure_trifold",
    name: "Tri-fold Brochure",
    category: "standard",
    width: 11,
    height: 8.5,
    bleed: 0.125,
    safeMargin: 0.25,
    minDPI: 300,
    recommendedDPI: 300,
    viewingDistance: "12-18 inches",
    notes: "Folds to 3.67\" panels. Keep text 0.25\" from fold lines for readability.",
  },
  {
    id: "booklet_half",
    name: "Half-Letter Booklet",
    category: "standard",
    width: 5.5,
    height: 8.5,
    bleed: 0.125,
    safeMargin: 0.375,
    minDPI: 300,
    recommendedDPI: 300,
    viewingDistance: "12-18 inches",
    notes: "Saddle-stitch booklet. Add 0.125\" to inside margin for binding.",
  },

  // LARGE FORMAT
  {
    id: "poster_11x17",
    name: "Poster (11x17 Tabloid)",
    category: "large",
    width: 11,
    height: 17,
    bleed: 0.125,
    safeMargin: 0.5,
    minDPI: 200,
    recommendedDPI: 300,
    viewingDistance: "2-4 feet",
    notes: "Small poster. 200 DPI acceptable for photos, 300 DPI for detailed graphics.",
  },
  {
    id: "poster_18x24",
    name: "Poster (18x24)",
    category: "large",
    width: 18,
    height: 24,
    bleed: 0.125,
    safeMargin: 0.5,
    minDPI: 150,
    recommendedDPI: 200,
    viewingDistance: "3-5 feet",
    notes: "Standard poster. 150 DPI minimum for photos at this viewing distance.",
  },
  {
    id: "poster_24x36",
    name: "Poster (24x36)",
    category: "large",
    width: 24,
    height: 36,
    bleed: 0.25,
    safeMargin: 0.75,
    minDPI: 100,
    recommendedDPI: 150,
    viewingDistance: "4-8 feet",
    notes: "Large poster. Don't stress about 300 DPI - viewers are farther away!",
  },
  {
    id: "yard_sign",
    name: "Yard Sign (18x24)",
    category: "large",
    width: 18,
    height: 24,
    bleed: 0,
    safeMargin: 1,
    minDPI: 100,
    recommendedDPI: 150,
    viewingDistance: "6-15 feet",
    notes: "Corrugated plastic. Bold text, high contrast. Viewed from car/sidewalk.",
  },
  {
    id: "foam_board_24x36",
    name: "Foam Board (24x36)",
    category: "large",
    width: 24,
    height: 36,
    bleed: 0,
    safeMargin: 0.5,
    minDPI: 100,
    recommendedDPI: 150,
    viewingDistance: "4-10 feet",
    notes: "Trade show/event signage. Focus on readability over photo detail.",
  },

  // EXTRA LARGE FORMAT
  {
    id: "banner_2x6",
    name: "Vinyl Banner (2x6 ft)",
    category: "xlarge",
    width: 24,
    height: 72,
    bleed: 0,
    safeMargin: 2,
    minDPI: 72,
    recommendedDPI: 100,
    viewingDistance: "8-20 feet",
    notes: "Outdoor banner. 72 DPI is fine! Focus on contrast and readability.",
  },
  {
    id: "banner_3x8",
    name: "Vinyl Banner (3x8 ft)",
    category: "xlarge",
    width: 36,
    height: 96,
    bleed: 0,
    safeMargin: 3,
    minDPI: 50,
    recommendedDPI: 72,
    viewingDistance: "15-30 feet",
    notes: "Large outdoor banner. Your phone photos are probably fine at this size!",
  },
  {
    id: "retractable_banner",
    name: "Retractable Banner (33x81)",
    category: "xlarge",
    width: 33,
    height: 81,
    bleed: 0,
    safeMargin: 2,
    minDPI: 72,
    recommendedDPI: 100,
    viewingDistance: "5-15 feet",
    notes: "Trade show essential. Bottom 8\" often hidden - don't put important content there.",
  },
  {
    id: "backdrop_8x8",
    name: "Backdrop (8x8 ft)",
    category: "xlarge",
    width: 96,
    height: 96,
    bleed: 0,
    safeMargin: 4,
    minDPI: 50,
    recommendedDPI: 72,
    viewingDistance: "10-30 feet",
    notes: "Photo backdrop/step-repeat. Patterns work better than detailed photos.",
  },
  {
    id: "vehicle_wrap",
    name: "Vehicle Wrap (Full)",
    category: "xlarge",
    width: 300, // approximate
    height: 60,
    bleed: 2,
    safeMargin: 2,
    minDPI: 50,
    recommendedDPI: 72,
    viewingDistance: "10-50 feet",
    notes: "Contour cut vinyl. Work with your printer on templates - every vehicle is different.",
  },
];

/**
 * Get jobs by category
 */
export function getJobsByCategory(category: PrintJob["category"]): PrintJob[] {
  return PRINT_JOBS.filter((job) => job.category === category);
}

/**
 * Get a job by ID
 */
export function getJobById(id: string): PrintJob | undefined {
  return PRINT_JOBS.find((job) => job.id === id);
}

/**
 * Calculate if a DPI value meets requirements for a job
 */
export function evaluateDPI(
  dpi: number,
  job: PrintJob
): "excellent" | "good" | "acceptable" | "low" | "critical" {
  if (dpi >= job.recommendedDPI) return "excellent";
  if (dpi >= job.minDPI) return "good";
  if (dpi >= job.minDPI * 0.75) return "acceptable";
  if (dpi >= job.minDPI * 0.5) return "low";
  return "critical";
}