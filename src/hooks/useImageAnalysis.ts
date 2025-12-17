/**
 * Image Analysis Hook
 * Analyzes selected images for print quality (DPI, resolution)
 */

import { useState, useCallback } from "react";
import { selection as designSelection } from "@canva/design";
import { getTemporaryUrl, type ImageRef } from "@canva/asset";
import type { PrintJob } from "../data/print_specs";
import { evaluateDPI } from "../data/print_specs";
import { calculateEffectiveDPI, calculateViewingDistance } from "../data/dpi_guidelines";

export interface ImageAnalysisResult {
    id: string;
    thumbnailUrl: string;
    pixelWidth: number;
    pixelHeight: number;
    placedWidthInches: number;
    placedHeightInches: number;
    effectiveDPI: number;
    horizontalDPI: number;
    verticalDPI: number;
    status: "excellent" | "good" | "acceptable" | "low" | "critical";
    viewingDistance: string;
    recommendationKey: string;
    recommendationValues?: Record<string, any>;
}

export interface AnalysisState {
    isAnalyzing: boolean;
    results: ImageAnalysisResult[];
    error: string | null;
    selectedCount: number;
}

const INCH = 96; // Canva uses 96 DPI for screen rendering

/**
 * Hook for analyzing selected images for print quality
 */
export function useImageAnalysis(currentJob: PrintJob | null) {
    const [state, setState] = useState<AnalysisState>({
        isAnalyzing: false,
        results: [],
        error: null,
        selectedCount: 0,
    });

    /**
     * Analyze currently selected images
     */
    const analyzeSelection = useCallback(async () => {
        if (!currentJob) {
            setState((prev) => ({
                ...prev,
                error: "Please select a print job first", // We'll handle this in the component or keep as is if it's internal
            }));
            return;
        }

        setState((prev) => ({
            ...prev,
            isAnalyzing: true,
            error: null,
            results: [],
        }));

        try {
            // Register a one-time selection read for images
            // Note: We need to use the selection API directly here
            const selectionEvent = await new Promise<{
                count: number;
                read: () => Promise<{
                    contents: ReadonlyArray<{ ref: string }>;
                }>;
            }>((resolve) => {
                const dispose = designSelection.registerOnChange({
                    scope: "image",
                    onChange: (event) => {
                        dispose();
                        resolve(event as any);
                    },
                });
                // Trigger an immediate check
                setTimeout(() => {
                    // If no event comes through quickly, resolve with empty
                    resolve({
                        count: 0,
                        read: async () => ({ contents: [] }),
                    });
                }, 100);
            });

            if (selectionEvent.count === 0) {
                setState({
                    isAnalyzing: false,
                    results: [],
                    error: "Please select one or more images on the canvas first",
                    selectedCount: 0,
                });
                return;
            }

            const draft = await selectionEvent.read();
            const results: ImageAnalysisResult[] = [];

            for (let i = 0; i < draft.contents.length; i++) {
                const content = draft.contents[i];

                try {
                    // Get the temporary URL for the image
                    // Cast string ref to ImageRef branded type required by the API
                    const { url } = await getTemporaryUrl({
                        type: "image",
                        ref: content.ref as ImageRef,
                    });

                    // Load the image to get its actual pixel dimensions
                    const img = new Image();
                    img.crossOrigin = "anonymous";

                    const imageDimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
                        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
                        img.onerror = () => reject(new Error("Failed to load image"));
                        img.src = url;
                    });

                    // For MVP, we'll assume the image fills the print area
                    // In a more advanced version, we could get the actual placed size from the element
                    const placedWidthInches = currentJob.width;
                    const placedHeightInches = currentJob.height;

                    // Calculate DPI
                    const dpiInfo = calculateEffectiveDPI(
                        imageDimensions.width,
                        imageDimensions.height,
                        placedWidthInches,
                        placedHeightInches
                    );

                    const status = evaluateDPI(dpiInfo.effective, currentJob);
                    const viewingInfo = calculateViewingDistance(dpiInfo.effective);

                    // Generate recommendation based on status
                    let recommendationKey: string;
                    let recommendationValues: Record<string, any> | undefined;

                    switch (status) {
                        case "excellent":
                            recommendationKey = "recommendationExcellent";
                            break;
                        case "good":
                            recommendationKey = "recommendationGood";
                            break;
                        case "acceptable":
                            recommendationKey = "recommendationAcceptable";
                            recommendationValues = { distance: viewingInfo.description };
                            break;
                        case "low":
                            recommendationKey = "recommendationLow";
                            break;
                        case "critical":
                            recommendationKey = "recommendationCritical";
                            recommendationValues = { 
                                width: Math.ceil(placedWidthInches * currentJob.minDPI),
                                height: Math.ceil(placedHeightInches * currentJob.minDPI)
                            };
                            break;
                        default:
                            recommendationKey = "recommendationGood";
                    }

                    results.push({
                        id: `image-${i}`,
                        thumbnailUrl: url,
                        pixelWidth: imageDimensions.width,
                        pixelHeight: imageDimensions.height,
                        placedWidthInches,
                        placedHeightInches,
                        effectiveDPI: dpiInfo.effective,
                        horizontalDPI: dpiInfo.horizontal,
                        verticalDPI: dpiInfo.vertical,
                        status,
                        viewingDistance: viewingInfo.description,
                        recommendationKey,
                        recommendationValues,
                    });
                } catch (imgError) {
                    console.error("Error analyzing image:", imgError);
                    // Continue with other images
                }
            }

            setState({
                isAnalyzing: false,
                results,
                error: results.length === 0 ? "Could not analyze selected images" : null,
                selectedCount: selectionEvent.count,
            });
        } catch (error) {
            console.error("Analysis error:", error);
            setState({
                isAnalyzing: false,
                results: [],
                error: "An error occurred while analyzing images. Make sure images are selected.",
                selectedCount: 0,
            });
        }
    }, [currentJob]);

    /**
     * Clear analysis results
     */
    const clearResults = useCallback(() => {
        setState({
            isAnalyzing: false,
            results: [],
            error: null,
            selectedCount: 0,
        });
    }, []);

    /**
     * Get overall status (worst status among all images)
     */
    const getOverallStatus = useCallback((): ImageAnalysisResult["status"] | null => {
        if (state.results.length === 0) return null;

        const statusPriority: ImageAnalysisResult["status"][] = [
            "critical",
            "low",
            "acceptable",
            "good",
            "excellent",
        ];

        for (const status of statusPriority) {
            if (state.results.some((r) => r.status === status)) {
                return status;
            }
        }
        return "excellent";
    }, [state.results]);

    return {
        ...state,
        analyzeSelection,
        clearResults,
        getOverallStatus,
    };
}
