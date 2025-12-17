import { defineMessages } from "react-intl";

export const messages = defineMessages({
  /**
   * App.tsx Messages
   */
  appTitle: {
    defaultMessage: "Printssistant",
    description: "The name of the application",
  },
  appSubtitle: {
    defaultMessage: "Professional preflight checks for print-ready designs. Built by prepress operators, for designers.",
    description: "App tagline",
  },
  worksWithFormats: {
    defaultMessage: "Works with all print formats",
    description: "Feature highlight",
  },
  getStarted: {
    defaultMessage: "Get Started",
    description: "Welcome button",
  },
  selectFormat: {
    defaultMessage: "Select Print Format",
    description: "Header for job selection",
  },
  chooseOutputSize: {
    defaultMessage: "Choose your target output size",
    description: "Instruction for job selection",
  },
  currentDesign: {
    defaultMessage: "Current design:",
    description: "Label for design dimensions",
  },
  sizeMismatch: {
    defaultMessage: "Your design size doesn't match {jobName} ({width}\" × {height}\"). You can still continue - we'll analyze based on your current size.",
    description: "Warning for size mismatch",
  },
  continueWithJob: {
    defaultMessage: "Continue with {jobName}",
    description: "Button to move to analysis",
  },
  back: {
    defaultMessage: "← Back",
    description: "Back button",
  },
  readyForPrint: {
    defaultMessage: "Ready for Print!",
    description: "Success header",
  },
  readyInstructions: {
    defaultMessage: "Go to Share → Download → PDF Print. Enable \"Crop marks and bleed\" for professional output.",
    description: "Success instructions",
  },
  manualChecks: {
    defaultMessage: "MANUAL CHECKS",
    description: "Section header",
  },
  markReviewed: {
    defaultMessage: "Mark Resolution as Reviewed",
    description: "Button text",
  },
  resolutionChecked: {
    defaultMessage: "✓ Resolution Checked",
    description: "Button text when checked",
  },
  markComplete: {
    defaultMessage: "Mark as Complete",
    description: "Button text for manual checks",
  },
  ready: {
    defaultMessage: "Ready",
    description: "Status badge text",
  },
  percentComplete: {
    defaultMessage: "{progress}% complete",
    description: "Progress text",
  },
  manualChecksSection: {
    defaultMessage: "MANUAL CHECKS",
    description: "Section header for manual checks",
  },
  somethingWentWrong: {
    defaultMessage: "Something went wrong. Please refresh.",
    description: "Error message",
  },
  startOver: {
    defaultMessage: "Start Over",
    description: "Button to start over",
  },

  /**
   * DPI Analyzer Messages
   */
  imageResolutionCheck: {
    defaultMessage: "Image Resolution Check",
    description: "DPI Analyzer section header",
  },
  readyToAnalyze: {
    defaultMessage: "Ready to Analyze",
    description: "Empty state title",
  },
  analyzeInstructions: {
    defaultMessage: "Select one or more images on your design canvas to check their print quality.",
    description: "Empty state subtitle",
  },
  forJobTip: {
    defaultMessage: "For {jobName}",
    description: "Tip header",
  },
  xlargeTip: {
    defaultMessage: "Large format prints are viewed from a distance. You only need {minDPI}-{recommendedDPI} DPI for this size. That's much lower than small prints!",
    description: "DPI tip for xlarge jobs",
  },
  largeTip: {
    defaultMessage: "At typical viewing distance ({distance}), you need {minDPI}+ DPI. Don't stress about hitting 300!",
    description: "DPI tip for large jobs",
  },
  smallTip: {
    defaultMessage: "Small format prints are viewed up close. Aim for {recommendedDPI} DPI for crisp results.",
    description: "DPI tip for small jobs",
  },
  analyzeImages: {
    defaultMessage: "Analyze Selected Images",
    description: "Analyze button",
  },
  analyzing: {
    defaultMessage: "Analyzing...",
    description: "Loading state button",
  },
  analyzingImages: {
    defaultMessage: "Analyzing images...",
    description: "Loading text",
  },
  clearResults: {
    defaultMessage: "Clear",
    description: "Clear button",
  },
  tryAgain: {
    defaultMessage: "Try Again",
    description: "Error state button",
  },
  imagesAnalyzed: {
    defaultMessage: "{count} {count, plural, one {Image} other {Images}} Analyzed",
    description: "Results header",
  },
  rescan: {
    defaultMessage: "Re-scan",
    description: "Rescan button",
  },
  howToFixTitle: {
    defaultMessage: "How to Fix Low Resolution",
    description: "Tip header",
  },
  fixOption1: {
    defaultMessage: "Option 1: Replace with a higher resolution image from Canva's library or upload a better source.",
    description: "Fix description",
  },
  fixOption2: {
    defaultMessage: "Option 2: Reduce the size of the image on your design - smaller = higher effective DPI.",
    description: "Fix description",
  },
  fixOption3: {
    defaultMessage: "Option 3: If this is for large format ({distance} viewing), the quality may actually be acceptable.",
    description: "Fix description",
  },
  notChecked: {
    defaultMessage: "Not checked",
    description: "Summary badge text",
  },
  dpiSummary: {
    defaultMessage: "{emoji} {count} {count, plural, one {image} other {images}} - {label}",
    description: "Summary badge text",
  },
  dpiValueStatus: {
    defaultMessage: "{emoji} {dpi} {label} {dash} {status}",
    description: "Detailed DPI display for an image",
  },
  imageLabel: {
    defaultMessage: "Image {index}",
    description: "Alt text for thumbnail",
  },
  pixelDimensions: {
    defaultMessage: "{width} × {height} pixels",
    description: "Image dimension info",
  },
  dpiLabel: {
    defaultMessage: "DPI",
    description: "Dots per inch label",
  },
  viewingDistanceLabel: {
    defaultMessage: "Viewing: {distance}",
    description: "Viewing distance info",
  },
  printDimensionsLabel: {
    defaultMessage: "Print: {width}\" × {height}\"",
    description: "Print size info",
  },

  /**
   * DPI Status Labels & Descriptions
   */
  statusExcellentLabel: { defaultMessage: "Excellent", description: "Status label" },
  statusExcellentDesc: { defaultMessage: "Image quality exceeds requirements. Will print beautifully!", description: "Status description" },
  statusGoodLabel: { defaultMessage: "Good", description: "Status label" },
  statusGoodDesc: { defaultMessage: "Meets recommended quality. Will print well.", description: "Status description" },
  statusAcceptableLabel: { defaultMessage: "Acceptable", description: "Status label" },
  statusAcceptableDesc: { defaultMessage: "Below recommended but may be acceptable depending on content.", description: "Status description" },
  statusLowLabel: { defaultMessage: "Low Quality", description: "Status label" },
  statusLowDesc: { defaultMessage: "Below minimum. May show visible pixelation when printed.", description: "Status description" },
  statusCriticalLabel: { defaultMessage: "Too Low", description: "Status label" },
  statusCriticalDesc: { defaultMessage: "Significantly below requirements. Will print blurry.", description: "Status description" },
  recommendationExcellent: {
    defaultMessage: "This image exceeds requirements and will print beautifully!",
    description: "Recommendation for excellent resolution",
  },
  recommendationGood: {
    defaultMessage: "This image meets quality standards for this print size.",
    description: "Recommendation for good resolution",
  },
  recommendationAcceptable: {
    defaultMessage: "Quality is borderline. Fine for viewing from {distance}.",
    description: "Recommendation for acceptable resolution",
  },
  recommendationLow: {
    defaultMessage: "Image may appear pixelated. Consider using a higher resolution image or reducing print size.",
    description: "Recommendation for low resolution",
  },
  recommendationCritical: {
    defaultMessage: "Image will print blurry! You need at least {width}x{height} pixels for this size.",
    description: "Recommendation for critical resolution",
  },

  /**
   * Print Categories
   */
  categorySmallName: { defaultMessage: "Small Format", description: "Category name" },
  categorySmallDesc: { defaultMessage: "Business cards, postcards, stickers", description: "Category description" },
  categoryStandardName: { defaultMessage: "Standard Print", description: "Category name" },
  categoryStandardDesc: { defaultMessage: "Flyers, brochures, booklets", description: "Category description" },
  categoryLargeName: { defaultMessage: "Large Format", description: "Category name" },
  categoryLargeDesc: { defaultMessage: "Posters, banners, signage", description: "Category description" },
  categoryXlargeName: { defaultMessage: "Extra Large Format", description: "Category name" },
  categoryXlargeDesc: { defaultMessage: "Vinyl banners, billboards, wraps", description: "Category description" },

  /**
   * Common Job Names (for translation mapping)
   */
  jobBizCardUs: { defaultMessage: "Business Card (US)", description: "Job name" },
  jobBizCardEu: { defaultMessage: "Business Card (EU)", description: "Job name" },
  jobFlyerLetter: { defaultMessage: "Flyer (Letter 8.5x11)", description: "Job name" },
  jobPoster24x36: { defaultMessage: "Poster (24x36)", description: "Job name" },
  jobVinylBanner2x6: { defaultMessage: "Vinyl Banner (2x6 ft)", description: "Job name" },
  // ... adding more as needed
  bleedCheckTitle: {
    defaultMessage: "Bleed & Trim Setup",
    description: "Title for bleed check",
  },
  bleedCheckDesc: {
    defaultMessage: "Extend backgrounds {bleed}\" past the trim line. Enable \"Show print bleed\" in View Settings.",
    description: "Description for bleed check",
  },
  bleedCheckTip: {
    defaultMessage: "Required bleed for {jobName}: {bleed}\"",
    description: "Tip for bleed check",
  },
  safeZoneTitle: {
    defaultMessage: "Safe Zone Check",
    description: "Title for safe zone check",
  },
  safeZoneDesc: {
    defaultMessage: "Keep text and logos at least {margin}\" from edges. Enable \"Show margins\" in View Settings.",
    description: "Description for safe zone check",
  },
  safeZoneTip: {
    defaultMessage: "Text too close to the edge may get cut off during trimming.",
    description: "Tip for safe zone check",
  },
  colorCheckTitle: {
    defaultMessage: "Color Mode Review",
    description: "Title for color mode review",
  },
  colorCheckDesc: {
    defaultMessage: "Export as PDF Print with CMYK color space for accurate colors. RGB may shift during conversion.",
    description: "Description for color mode review",
  },
  colorCheckTip: {
    defaultMessage: "CMYK export is a Canva Pro feature.",
    description: "Tip for color mode review",
  },

  /**
   * Education Labels
   */
  labelLearn: { defaultMessage: "Learn", description: "Category label" },
  labelLargeFormat: { defaultMessage: "Large Format", description: "Category label" },
  labelWatchOut: { defaultMessage: "Watch Out", description: "Category label" },
  labelProTip: { defaultMessage: "Pro Tip", description: "Category label" },
  labelTip: { defaultMessage: "Tip", description: "Category label" },
  labelPrepressNote: { defaultMessage: "Prepress Note", description: "Note label" },

  /**
   * Large Format Education
   */
  largeFormatTitle: { defaultMessage: "Large Format = Different Rules", description: "Section title" },
  viewingDistanceFor: { defaultMessage: "Viewing distance for {jobName}:", description: "Label" },
  requiredDPI: { defaultMessage: "Required DPI:", description: "Label" },
  yesReallyLow: { defaultMessage: " (yes, really that low!)", description: "Emphasis" },
  whyLargeFormatTitle: { defaultMessage: "Why?", description: "Explanation label" },
  whyLargeFormatDesc: { 
    defaultMessage: "The further away you view something, the less detail your eye can resolve. A billboard at 50 DPI looks perfect from the road!", 
    description: "Explanation" 
  },
  prevTip: { defaultMessage: "Previous tip", description: "Aria label" },
  nextTip: { defaultMessage: "Next tip", description: "Aria label" },
  tipCounter: { defaultMessage: "{current} / {total}", description: "Carousel counter" },
  symbolSeparator: { defaultMessage: " × ", description: "Dimensions separator" },
  symbolUnitInch: { defaultMessage: "\"", description: "Inches unit" },
  symbolColon: { defaultMessage: ":", description: "Colon separator" },
  symbolBullet: { defaultMessage: "•", description: "Bullet point" },
  symbolDash: { defaultMessage: "-", description: "Dash separator" },
  symbolDropdown: { defaultMessage: "▼", description: "Dropdown icon" },
  symbolCheck: { defaultMessage: "✓", description: "Checkmark" },
  symbolArrowRight: { defaultMessage: "→", description: "Arrow" },
  symbolArrowLeft: { defaultMessage: "←", description: "Arrow" },
  symbolPen: { defaultMessage: "✎", description: "Edit icon" },
  symbolEmojiPrinter: { defaultMessage: "Printer", description: "Printer label" },
  symbolEmojiCheck: { defaultMessage: "Check", description: "Check label" },
  symbolEmojiWarning: { defaultMessage: "Warning", description: "Warning label" },
  symbolEmojiParty: { defaultMessage: "Success", description: "Success label" },
  symbolEmojiIdea: { defaultMessage: "Tip", description: "Tip label" },
  symbolEmojiChart: { defaultMessage: "Chart", description: "Chart label" },
  symbolEmojiSearch: { defaultMessage: "Search", description: "Search label" },
  symbolEmojiPicture: { defaultMessage: "Picture", description: "Picture label" },
  symbolEmojiBooks: { defaultMessage: "Books", description: "Books label" },
});
