/**
 * Main App Component
 * Printssistant: Expert prepress prep in Canva
 */

import React, { useState, useEffect } from "react";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
import { getCurrentPageContext } from "@canva/design";
import { useImageAnalysis } from "./hooks/useImageAnalysis";
import { DPIAnalyzer, DPISummaryBadge } from "./components/DPIAnalyzer";
import { JobSelector, JobBadge } from "./components/JobSelector";
import { ContextualTips, LargeFormatEducation, TipCard } from "./components/Tips";
import { getJobById, type PrintJob } from "./data/print_specs";
import { DPI_TIPS } from "./data/dpi_guidelines";
import { messages } from "./i18n/messages";

type View = "welcome" | "job-select" | "main";

export function App() {
  const intl = useIntl();
  const [view, setView] = useState<View>("welcome");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const [pageDimensions, setPageDimensions] = useState<{ widthInches: number; heightInches: number } | null>(null);
  const [sizeMatch, setSizeMatch] = useState<"match" | "mismatch" | "unknown">("unknown");

  const currentJob = selectedJobId ? getJobById(selectedJobId) || null : null;
  const imageAnalysis = useImageAnalysis(currentJob as PrintJob | null);

  // Get current design context
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const context = await getCurrentPageContext();
        if (context && context.dimensions) {
          // Canva SDK provides dimensions in points (1/72 inch)
          const widthInches = context.dimensions.width / 72;
          const heightInches = context.dimensions.height / 72;
          setPageDimensions({ widthInches, heightInches });
        }
      } catch {
        // Silent error for prod-ready
      }
    };
    fetchContext();
  }, []);

  // Check if design size matches current job
  useEffect(() => {
    if (pageDimensions && currentJob) {
      const wDiff = Math.abs(pageDimensions.widthInches - currentJob.width);
      const hDiff = Math.abs(pageDimensions.heightInches - currentJob.height);
      // Tolerance of 0.1 inch
      if (wDiff < 0.1 && hDiff < 0.1) {
        setSizeMatch("match");
      } else {
        setSizeMatch("mismatch");
      }
    }
  }, [pageDimensions, currentJob]);

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setCompletedChecks([]); // Reset checklist for new job
  };

  const toggleCheck = (id: string) => {
    setCompletedChecks((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const requiredChecks = ["dpi_check", "bleed_check", "safe_zone"];
  const completedRequired = requiredChecks.filter((id) =>
    completedChecks.includes(id)
  ).length;
  const progress = Math.round((completedRequired / requiredChecks.length) * 100);

  // ========================
  // RENDER: Welcome Screen
  // ========================
  if (view === "welcome") {
    return (
      <div className="printssistant-app">
        <div className="welcome-container">
          <div className="welcome-logo" aria-hidden="true">
            {intl.formatMessage(messages.symbolEmojiPrinter)}
          </div>
          <h1 className="welcome-title">
            <FormattedMessage {...messages.appTitle} />
          </h1>
          <p className="welcome-subtitle">
            <FormattedMessage {...messages.appSubtitle} />
          </p>
          
          <div className="welcome-badge">
            <span aria-hidden="true">{intl.formatMessage(messages.symbolEmojiCheck)}</span>
            <span>
              <FormattedMessage {...messages.worksWithFormats} />
            </span>
          </div>

          <Button
            variant="primary"
            onClick={() => setView("job-select")}
            stretch
          >
            {intl.formatMessage(messages.getStarted)}
          </Button>

          <div className="mt-lg">
            {(() => {
              const tip = DPI_TIPS.find((t) => t.id === "large_format_myth");
              return tip ? <TipCard tip={tip} variant="compact" /> : null;
            })()}
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // RENDER: Job Selection
  // ========================
  if (view === "job-select") {
    return (
      <div className="printssistant-app" style={{ padding: "var(--space-lg)" }}>
        <Rows spacing="2u">
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
              <FormattedMessage {...messages.selectFormat} />
            </div>
            <Text size="small" tone="tertiary">
              <FormattedMessage {...messages.chooseOutputSize} />
            </Text>
          </div>

          {pageDimensions && (
            <div
              style={{
                background: "var(--bg-tertiary)",
                padding: "var(--space-sm) var(--space-md)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
              }}
            >
              <strong>
                <FormattedMessage {...messages.currentDesign} />
              </strong>
              <span aria-hidden="true" style={{ marginLeft: "4px" }}>
                {pageDimensions.widthInches.toFixed(2)}
                {intl.formatMessage(messages.symbolUnitInch)}
                {intl.formatMessage(messages.symbolSeparator)}
                {pageDimensions.heightInches.toFixed(2)}
                {intl.formatMessage(messages.symbolUnitInch)}
              </span>
            </div>
          )}

          <JobSelector
            selectedJobId={selectedJobId}
            onSelectJob={handleSelectJob}
          />

          {currentJob && (
            <Rows spacing="1u">
              {sizeMatch === "mismatch" && (
                <div className="size-warning">
                  <span className="size-warning-icon" aria-hidden="true">
                    {intl.formatMessage(messages.symbolEmojiWarning)}
                  </span>
                  <div className="size-warning-text">
                    <FormattedMessage 
                      {...messages.sizeMismatch} 
                      values={{ 
                        jobName: currentJob.name,
                        width: currentJob.width,
                        height: currentJob.height
                      }} 
                    />
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                onClick={() => setView("main")}
                stretch
              >
                {intl.formatMessage(messages.continueWithJob, { jobName: currentJob.name })}
              </Button>
            </Rows>
          )}

          <Button
            variant="secondary"
            onClick={() => setView("welcome")}
            stretch
          >
            {intl.formatMessage(messages.back)}
          </Button>
        </Rows>
      </div>
    );
  }

  // ========================
  // RENDER: Main Analysis View
  // ========================
  if (view === "main" && currentJob) {
    return (
      <div className="printssistant-app">
        {/* Header */}
        <div
          style={{
            padding: "var(--space-md) var(--space-lg)",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <JobBadge job={currentJob} onClick={() => setView("job-select")} />
          {progress === 100 ? (
            <span className="status-badge excellent">
              <span aria-hidden="true">{intl.formatMessage(messages.symbolEmojiCheck)}</span>
              <span style={{ marginLeft: "4px" }}>
                <FormattedMessage {...messages.ready} />
              </span>
            </span>
          ) : (
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              <FormattedMessage {...messages.percentComplete} values={{ progress }} />
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="progress-container" style={{ padding: "0 var(--space-lg)" }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Large format education */}
        {(currentJob.category === "large" || currentJob.category === "xlarge") && (
          <div style={{ padding: "var(--space-lg)" }}>
            <LargeFormatEducation job={currentJob} />
          </div>
        )}

        {/* DPI Analyzer Section */}
        <div style={{ borderBottom: "1px solid var(--border-light)" }}>
          <div
            style={{
              padding: "var(--space-md) var(--space-lg)",
              background: "var(--bg-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <span style={{ fontSize: "16px" }} aria-hidden="true">
                {intl.formatMessage(messages.symbolEmojiChart)}
              </span>
              <span style={{ fontWeight: 700, fontSize: "14px" }}>
                {intl.formatMessage(messages.imageResolutionCheck)}
              </span>
            </div>
            <DPISummaryBadge
              status={imageAnalysis.getOverallStatus()}
              count={imageAnalysis.results.length}
            />
          </div>

          <DPIAnalyzer
            isAnalyzing={imageAnalysis.isAnalyzing}
            results={imageAnalysis.results}
            error={imageAnalysis.error}
            selectedCount={imageAnalysis.selectedCount}
            currentJob={currentJob}
            onAnalyze={imageAnalysis.analyzeSelection}
            onClear={imageAnalysis.clearResults}
          />

          {imageAnalysis.results.length > 0 && (
            <div style={{ padding: "0 var(--space-lg) var(--space-lg)" }}>
              <Button
                variant={imageAnalysis.getOverallStatus() === "critical" || imageAnalysis.getOverallStatus() === "low" ? "secondary" : "primary"}
                onClick={() => toggleCheck("dpi_check")}
                stretch
              >
                {completedChecks.includes("dpi_check")
                  ? intl.formatMessage(messages.resolutionChecked)
                  : intl.formatMessage(messages.markReviewed)}
              </Button>
            </div>
          )}
        </div>

        {/* Manual Checks Section */}
        <div style={{ padding: "var(--space-lg)" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", color: "var(--text-muted)" }}>
            <FormattedMessage {...messages.manualChecksSection} />
          </div>
          
          <div style={{ marginTop: "var(--space-md)" }}>
            <ManualCheckItem
              id="bleed_check"
              title={intl.formatMessage(messages.bleedCheckTitle)}
              description={intl.formatMessage(messages.bleedCheckDesc, { bleed: currentJob.bleed })}
              isComplete={completedChecks.includes("bleed_check")}
              onToggle={() => toggleCheck("bleed_check")}
              tip={intl.formatMessage(messages.bleedCheckTip, { jobName: currentJob.name, bleed: currentJob.bleed })}
            />

            <ManualCheckItem
              id="safe_zone"
              title={intl.formatMessage(messages.safeZoneTitle)}
              description={intl.formatMessage(messages.safeZoneDesc, { margin: currentJob.safeMargin })}
              isComplete={completedChecks.includes("safe_zone")}
              onToggle={() => toggleCheck("safe_zone")}
              tip={intl.formatMessage(messages.safeZoneTip)}
            />

            <ManualCheckItem
              id="color_check"
              title={intl.formatMessage(messages.colorCheckTitle)}
              description={intl.formatMessage(messages.colorCheckDesc)}
              isComplete={completedChecks.includes("color_check")}
              onToggle={() => toggleCheck("color_check")}
              tip={intl.formatMessage(messages.colorCheckTip)}
              isOptional
            />
          </div>
        </div>

        {/* Success State */}
        {progress === 100 && (
          <div
            style={{
              padding: "var(--space-lg)",
              background: "var(--status-excellent-bg)",
              margin: "var(--space-lg)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "var(--space-sm)" }} aria-hidden="true">
              {intl.formatMessage(messages.symbolEmojiParty)}
            </div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--status-excellent)" }}>
              <FormattedMessage {...messages.readyForPrint} />
            </div>
            <Text size="small" tone="tertiary">
              <FormattedMessage {...messages.readyInstructions} />
            </Text>
          </div>
        )}

        {/* Tips at bottom */}
        <div style={{ padding: "var(--space-lg)" }}>
          <ContextualTips job={currentJob} showCount={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="printssistant-app" style={{ padding: "var(--space-lg)" }}>
      <Text>
        <FormattedMessage {...messages.somethingWentWrong} />
      </Text>
      <Button variant="secondary" onClick={() => setView("welcome")}>
        {intl.formatMessage(messages.startOver)}
      </Button>
    </div>
  );
}

/**
 * Manual check item component
 */
interface ManualCheckItemProps {
  id: string;
  title: string;
  description: string;
  tip?: string;
  isComplete: boolean;
  isOptional?: boolean;
  onToggle: () => void;
}

function ManualCheckItem({
  id,
  title,
  description,
  tip,
  isComplete,
  isOptional,
  onToggle,
}: ManualCheckItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const intl = useIntl();

  return (
    <div
      className={`checklist-item ${isComplete ? "complete" : ""} ${isExpanded ? "expanded" : ""}`}
    >
      <div
        className="checklist-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className="checklist-checkbox"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {isComplete && <span aria-hidden="true">{intl.formatMessage(messages.symbolEmojiCheck)}</span>}
        </div>
        <span className="checklist-title">
          {title}
          {isOptional && (
            <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "6px" }}>
              <span aria-hidden="true">{intl.formatMessage(messages.symbolArrowLeft)}</span>
              <FormattedMessage defaultMessage="Optional" description="Optional label" />
              <span aria-hidden="true">{intl.formatMessage(messages.symbolArrowRight)}</span>
            </span>
          )}
        </span>
        <span className="checklist-expand-icon" aria-hidden="true">
          {intl.formatMessage(messages.symbolDropdown)}
        </span>
      </div>

      {isExpanded && (
        <div className="checklist-body">
          <div className="checklist-description">{description}</div>
          {tip && (
            <div
              style={{
                fontSize: "11px",
                color: "var(--print-primary)",
                marginTop: "var(--space-sm)",
              }}
            >
              <span aria-hidden="true">{intl.formatMessage(messages.symbolEmojiIdea)}</span> {tip}
            </div>
          )}
          {!isComplete && (
              <Button
                variant="primary"
                onClick={onToggle}
              >
                {intl.formatMessage(messages.markComplete)}
              </Button>
          )}
        </div>
      )}
    </div>
  );
}