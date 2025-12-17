/**
 * Preflight State Management Hook
 * Manages the overall state of the preflight workflow
 */

import { useState, useCallback, useEffect } from "react";
import { getCurrentPageContext } from "@canva/design";
import type { PrintJob } from "../data/print_specs";
import { PRINT_JOBS, getJobById } from "../data/print_specs";

export type PreflightStep = "welcome" | "job-select" | "analysis" | "checklist" | "complete";

export interface PreflightCheck {
    id: string;
    title: string;
    description: string;
    isComplete: boolean;
    isRequired: boolean;
    category: "automated" | "manual";
}

export interface PageDimensions {
    widthInches: number;
    heightInches: number;
    widthPx: number;
    heightPx: number;
}

export interface PreflightState {
    currentStep: PreflightStep;
    selectedJobId: string | null;
    currentJob: PrintJob | null;
    pageDimensions: PageDimensions | null;
    sizeMatch: "match" | "mismatch" | "unknown";
    checks: PreflightCheck[];
    isLoading: boolean;
}

const INCH = 96; // Canva uses 96 DPI for screen

const DEFAULT_CHECKS: PreflightCheck[] = [
    {
        id: "dpi_check",
        title: "Image Resolution Check",
        description: "Analyze images for print quality",
        isComplete: false,
        isRequired: true,
        category: "automated",
    },
    {
        id: "bleed_setup",
        title: "Bleed & Trim Setup",
        description: "Verify bleed extends past cut lines",
        isComplete: false,
        isRequired: true,
        category: "manual",
    },
    {
        id: "safe_zone",
        title: "Safe Zone Check",
        description: "Keep important content away from edges",
        isComplete: false,
        isRequired: true,
        category: "manual",
    },
    {
        id: "color_check",
        title: "Color Mode Review",
        description: "Ensure colors are print-ready",
        isComplete: false,
        isRequired: false,
        category: "manual",
    },
];

/**
 * Main preflight state management hook
 */
export function usePreflightState() {
    const [state, setState] = useState<PreflightState>({
        currentStep: "welcome",
        selectedJobId: null,
        currentJob: null,
        pageDimensions: null,
        sizeMatch: "unknown",
        checks: DEFAULT_CHECKS,
        isLoading: false,
    });

    /**
     * Fetch current page dimensions from Canva
     */
    const fetchPageDimensions = useCallback(async () => {
        try {
            const ctx = await getCurrentPageContext();
            if (ctx?.dimensions) {
                const dimensions: PageDimensions = {
                    widthPx: ctx.dimensions.width,
                    heightPx: ctx.dimensions.height,
                    widthInches: ctx.dimensions.width / INCH,
                    heightInches: ctx.dimensions.height / INCH,
                };
                setState((prev) => ({ ...prev, pageDimensions: dimensions }));
                return dimensions;
            }
        } catch (error) {
            console.error("Error fetching page dimensions:", error);
        }
        return null;
    }, []);

    /**
     * Select a print job and verify size match
     */
    const selectJob = useCallback(
        async (jobId: string) => {
            setState((prev) => ({ ...prev, isLoading: true }));

            const job = getJobById(jobId);
            if (!job) {
                setState((prev) => ({ ...prev, isLoading: false }));
                return;
            }

            // Fetch current dimensions
            const dimensions = await fetchPageDimensions();

            // Check size match
            let sizeMatch: "match" | "mismatch" | "unknown" = "unknown";
            if (dimensions) {
                const tolerance = 0.1; // 0.1 inch tolerance
                const matchesNormal =
                    Math.abs(dimensions.widthInches - job.width) < tolerance &&
                    Math.abs(dimensions.heightInches - job.height) < tolerance;
                const matchesRotated =
                    Math.abs(dimensions.widthInches - job.height) < tolerance &&
                    Math.abs(dimensions.heightInches - job.width) < tolerance;

                sizeMatch = matchesNormal || matchesRotated ? "match" : "mismatch";
            }

            setState((prev) => ({
                ...prev,
                selectedJobId: jobId,
                currentJob: job,
                sizeMatch,
                isLoading: false,
                // Reset checks when job changes
                checks: DEFAULT_CHECKS.map((c) => ({ ...c, isComplete: false })),
            }));
        },
        [fetchPageDimensions]
    );

    /**
     * Navigate to a specific step
     */
    const goToStep = useCallback((step: PreflightStep) => {
        setState((prev) => ({ ...prev, currentStep: step }));
    }, []);

    /**
     * Mark a check as complete/incomplete
     */
    const toggleCheck = useCallback((checkId: string) => {
        setState((prev) => ({
            ...prev,
            checks: prev.checks.map((c) =>
                c.id === checkId ? { ...c, isComplete: !c.isComplete } : c
            ),
        }));
    }, []);

    /**
     * Complete a check (mark as done)
     */
    const completeCheck = useCallback((checkId: string) => {
        setState((prev) => ({
            ...prev,
            checks: prev.checks.map((c) =>
                c.id === checkId ? { ...c, isComplete: true } : c
            ),
        }));
    }, []);

    /**
     * Get progress percentage
     */
    const getProgress = useCallback((): number => {
        const requiredChecks = state.checks.filter((c) => c.isRequired);
        if (requiredChecks.length === 0) return 100;
        const completed = requiredChecks.filter((c) => c.isComplete).length;
        return Math.round((completed / requiredChecks.length) * 100);
    }, [state.checks]);

    /**
     * Check if all required checks are complete
     */
    const isReadyForExport = useCallback((): boolean => {
        return state.checks.filter((c) => c.isRequired).every((c) => c.isComplete);
    }, [state.checks]);

    /**
     * Start over / reset
     */
    const reset = useCallback(() => {
        setState({
            currentStep: "welcome",
            selectedJobId: null,
            currentJob: null,
            pageDimensions: null,
            sizeMatch: "unknown",
            checks: DEFAULT_CHECKS.map((c) => ({ ...c, isComplete: false })),
            isLoading: false,
        });
    }, []);

    // Fetch dimensions on mount
    useEffect(() => {
        fetchPageDimensions();
    }, [fetchPageDimensions]);

    return {
        ...state,
        selectJob,
        goToStep,
        toggleCheck,
        completeCheck,
        getProgress,
        isReadyForExport,
        reset,
        fetchPageDimensions,
    };
}
