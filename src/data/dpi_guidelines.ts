/**
 * DPI Education & Guidelines
 * Real-world prepress knowledge for designers
 */

export interface DPITip {
    id: string;
    title: string;
    content: string;
    category: "general" | "large_format" | "common_mistake" | "pro_tip";
}

/**
 * Educational tips about DPI and resolution
 * These appear contextually based on the user's design
 */
export const DPI_TIPS: DPITip[] = [
    // General Knowledge
    {
        id: "what_is_dpi",
        title: "What is DPI?",
        content:
            "DPI (Dots Per Inch) measures print resolution. Higher DPI = more detail, but for large prints viewed from a distance, lower DPI is perfectly acceptable.",
        category: "general",
    },
    {
        id: "dpi_vs_ppi",
        title: "DPI vs PPI",
        content:
            "PPI (Pixels Per Inch) is for screens, DPI is for print. When we say your image needs '300 DPI,' we mean it should have enough pixels to print at 300 dots per inch at your desired size.",
        category: "general",
    },
    {
        id: "viewing_distance",
        title: "The Viewing Distance Secret",
        content:
            "A billboard at 25 DPI looks perfect from 100 feet away. A business card needs 300+ DPI because you hold it 12 inches from your face. Distance is everything!",
        category: "general",
    },

    // Large Format Specific
    {
        id: "large_format_myth",
        title: "The 300 DPI Myth",
        content:
            "You do NOT need 300 DPI for large format prints! A 3x8 ft banner at 72 DPI looks great because nobody views it from 6 inches away.",
        category: "large_format",
    },
    {
        id: "banner_dpi",
        title: "Banner Resolution Guide",
        content:
            "For vinyl banners: 50-72 DPI for outdoor use, 100-150 DPI for trade show displays. Your phone photos (12MP+) are usually sufficient!",
        category: "large_format",
    },
    {
        id: "large_format_formula",
        title: "Quick DPI Formula",
        content:
            "Optimal DPI = 3438 ÷ viewing distance (in inches). For a sign viewed from 10 feet (120 inches): 3438 ÷ 120 = ~29 DPI minimum.",
        category: "large_format",
    },
    {
        id: "dont_upscale",
        title: "Never Upscale for DPI",
        content:
            "Resizing a 72 DPI image to 300 DPI in Photoshop doesn't add detail - it just makes the file bigger. You can't create pixels that aren't there.",
        category: "large_format",
    },

    // Common Mistakes
    {
        id: "web_images",
        title: "Downloaded Web Images",
        content:
            "Images from Google/websites are typically 72-150 DPI and small. They may look fine on screen but will print blurry on even small format prints.",
        category: "common_mistake",
    },
    {
        id: "social_media_images",
        title: "Social Media Graphics",
        content:
            "Facebook, Instagram, and other platforms compress images. Re-using social graphics for print often results in pixelation. Always use original files.",
        category: "common_mistake",
    },
    {
        id: "logo_raster",
        title: "Raster Logos",
        content:
            "If your logo is a JPG or PNG, you may hit quality limits. Vector logos (AI, EPS, SVG, PDF) scale infinitely without quality loss.",
        category: "common_mistake",
    },
    {
        id: "screenshot_warning",
        title: "Screenshots Don't Print Well",
        content:
            "Screenshots are screen resolution (72-96 PPI) and often heavily compressed. Never use screenshots for print materials.",
        category: "common_mistake",
    },

    // Pro Tips
    {
        id: "native_resolution",
        title: "Check Original Image Size",
        content:
            "An image's print quality depends on its pixel dimensions, not the DPI metadata. A 3000x2000 pixel image can print at 10x6.67\" at 300 DPI.",
        category: "pro_tip",
    },
    {
        id: "photo_sources",
        title: "Where to Get Print-Ready Images",
        content:
            "Stock sites like Shutterstock, Adobe Stock, and Getty offer high-res downloads. Canva Pro images are generally print-ready for standard formats.",
        category: "pro_tip",
    },
    {
        id: "phone_photos",
        title: "Modern Phone Photos",
        content:
            "iPhone/Android photos (12-48MP) are often sufficient for large prints. A 12MP photo (4000x3000 pixels) prints beautifully at 13x10\" at 300 DPI, or 55x41\" at 72 DPI!",
        category: "pro_tip",
    },
    {
        id: "zoom_test",
        title: "Quick Quality Check",
        content:
            "Zoom to 200% in Canva. If images look blurry at 200%, they'll likely print blurry. This is a fast way to spot problems.",
        category: "pro_tip",
    },
];

/**
 * DPI status levels with user-friendly descriptions
 */
export const DPI_STATUS = {
    excellent: {
        label: "Excellent",
        color: "#10B981", // green
        emoji: "✅",
        description: "Image quality exceeds requirements. Will print beautifully!",
    },
    good: {
        label: "Good",
        color: "#22C55E", // light green
        emoji: "👍",
        description: "Meets recommended quality. Will print well.",
    },
    acceptable: {
        label: "Acceptable",
        color: "#F59E0B", // amber
        emoji: "⚠️",
        description: "Below recommended but may be acceptable depending on content.",
    },
    low: {
        label: "Low Quality",
        color: "#F97316", // orange
        emoji: "🔶",
        description: "Below minimum. May show visible pixelation when printed.",
    },
    critical: {
        label: "Too Low",
        color: "#EF4444", // red
        emoji: "🛑",
        description: "Significantly below requirements. Will print blurry.",
    },
} as const;

/**
 * Calculate required pixels for a given print size and DPI
 */
export function calculateRequiredPixels(
    widthInches: number,
    heightInches: number,
    targetDPI: number
): { width: number; height: number } {
    return {
        width: Math.ceil(widthInches * targetDPI),
        height: Math.ceil(heightInches * targetDPI),
    };
}

/**
 * Calculate effective DPI from image dimensions and print size
 */
export function calculateEffectiveDPI(
    imagePixelWidth: number,
    imagePixelHeight: number,
    printWidthInches: number,
    printHeightInches: number
): { horizontal: number; vertical: number; effective: number } {
    const horizontalDPI = imagePixelWidth / printWidthInches;
    const verticalDPI = imagePixelHeight / printHeightInches;
    // Use the lower value as the effective DPI (constraining factor)
    const effective = Math.min(horizontalDPI, verticalDPI);

    return {
        horizontal: Math.round(horizontalDPI),
        vertical: Math.round(verticalDPI),
        effective: Math.round(effective),
    };
}

/**
 * Calculate optimal viewing distance for a given DPI
 * Based on the human eye resolution limit
 */
export function calculateViewingDistance(dpi: number): {
    minFeet: number;
    description: string;
} {
    // Human eye can resolve ~1 arcminute, translates to this formula
    const minInches = 3438 / dpi;
    const minFeet = minInches / 12;

    let description: string;
    if (minFeet < 1) {
        description = `${Math.round(minInches)} inches or closer`;
    } else if (minFeet < 3) {
        description = `${minFeet.toFixed(1)} feet (arm's length)`;
    } else if (minFeet < 10) {
        description = `${Math.round(minFeet)} feet (across a room)`;
    } else {
        description = `${Math.round(minFeet)}+ feet (outdoor signage distance)`;
    }

    return { minFeet, description };
}

/**
 * Get a random tip from a category
 */
export function getRandomTip(
    category?: DPITip["category"]
): DPITip {
    const tips = category
        ? DPI_TIPS.filter((t) => t.category === category)
        : DPI_TIPS;
    return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Get tips relevant to a specific DPI situation
 */
export function getRelevantTips(
    effectiveDPI: number,
    requiredDPI: number,
    isLargeFormat: boolean
): DPITip[] {
    const tips: DPITip[] = [];

    // Add large format tips if applicable
    if (isLargeFormat) {
        tips.push(...DPI_TIPS.filter((t) => t.category === "large_format").slice(0, 2));
    }

    // Add general tip
    tips.push(DPI_TIPS.find((t) => t.id === "viewing_distance")!);

    // If DPI is low, add relevant mistake tips
    if (effectiveDPI < requiredDPI) {
        tips.push(
            DPI_TIPS.find((t) => t.id === "web_images")!,
            DPI_TIPS.find((t) => t.id === "zoom_test")!
        );
    }

    // Add a pro tip
    tips.push(DPI_TIPS.find((t) => t.id === "phone_photos")!);

    return tips.filter(Boolean); // Remove any undefined
}
