/**
 * DPI Analyzer Component
 * Analyzes and displays image resolution quality for print
 */

import React from "react";
import { Button, Rows, Text, ImageCard } from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
import type { ImageAnalysisResult } from "../hooks/useImageAnalysis";
import { DPI_STATUS } from "../data/dpi_guidelines";
import type { PrintJob } from "../data/print_specs";
import { messages } from "../i18n/messages";

interface DPIAnalyzerProps {
  isAnalyzing: boolean;
  results: ImageAnalysisResult[];
  error: string | null;
  selectedCount: number;
  currentJob: PrintJob | null;
  onAnalyze: () => void;
  onClear: () => void;
}

export function DPIAnalyzer({
  isAnalyzing,
  results,
  error,
  selectedCount,
  currentJob,
  onAnalyze,
  onClear,
}: DPIAnalyzerProps) {
  const intl = useIntl();

  // Initial state - no analysis run yet
  if (results.length === 0 && !isAnalyzing && !error) {
    return (
      <div className="analysis-container">
        <Rows spacing="2u">
          <div className="empty-state">
            <div className="empty-state-icon" aria-hidden="true">
              {intl.formatMessage(messages.symbolEmojiSearch)}
            </div>
            <div className="empty-state-title">
              <FormattedMessage {...messages.readyToAnalyze} />
            </div>
            <div className="empty-state-description">
              <FormattedMessage {...messages.analyzeInstructions} />
            </div>
          </div>

          {currentJob && (
            <div className="tip-card">
              <div className="tip-header">
                <span className="tip-icon" aria-hidden="true">
                  {intl.formatMessage(messages.symbolEmojiIdea)}
                </span>
                <span className="tip-title">
                  <FormattedMessage {...messages.forJobTip} values={{ jobName: currentJob.name }} />
                </span>
              </div>
              <div className="tip-content">
                {currentJob.category === "xlarge" ? (
                  <FormattedMessage 
                    {...messages.xlargeTip} 
                    values={{ 
                      minDPI: currentJob.minDPI, 
                      recommendedDPI: currentJob.recommendedDPI 
                    }} 
                  />
                ) : currentJob.category === "large" ? (
                  <FormattedMessage 
                    {...messages.largeTip} 
                    values={{ 
                      distance: currentJob.viewingDistance, 
                      minDPI: currentJob.minDPI 
                    }} 
                  />
                ) : (
                  <FormattedMessage 
                    {...messages.smallTip} 
                    values={{ 
                      recommendedDPI: currentJob.recommendedDPI 
                    }} 
                  />
                )}
              </div>
            </div>
          )}

          <Button variant="primary" onClick={onAnalyze} stretch>
            {intl.formatMessage(messages.analyzeImages)}
          </Button>
        </Rows>
      </div>
    );
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <div className="loading-text">
          <FormattedMessage {...messages.analyzingImages} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="analysis-container">
        <Rows spacing="2u">
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            padding: "var(--space-md)", 
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239, 68, 68, 0.3)"
          }}>
            <Text tone="critical" size="small">
              {error}
            </Text>
          </div>
          <Button variant="secondary" onClick={onClear} stretch>
            {intl.formatMessage(messages.tryAgain)}
          </Button>
        </Rows>
      </div>
    );
  }

  // Results state
  return (
    <div className="analysis-container">
      <Rows spacing="2u">
        <div className="analysis-header">
          <span className="analysis-title">
            <FormattedMessage {...messages.imagesAnalyzed} values={{ count: results.length }} />
          </span>
          <Button
            variant="secondary"
            onClick={onAnalyze}
          >
            {intl.formatMessage(messages.rescan)}
          </Button>
        </div>

        <div className="analysis-results">
          {results.map((result, index) => (
            <ImageResultCard key={result.id} result={result} index={index} />
          ))}
        </div>

        {currentJob && results.some((r) => r.status === "critical" || r.status === "low") && (
          <div className="tip-card">
            <div className="tip-header">
              <span className="tip-icon" aria-hidden="true">
                {intl.formatMessage(messages.symbolEmojiIdea)}
              </span>
              <span className="tip-title">
                <FormattedMessage {...messages.howToFixTitle} />
              </span>
            </div>
            <div className="tip-content">
              <strong>
                <FormattedMessage {...messages.fixOption1} />
              </strong>
              <br /><br />
              <strong>
                <FormattedMessage {...messages.fixOption2} />
              </strong>
              <br /><br />
              <strong>
                <FormattedMessage 
                  {...messages.fixOption3} 
                  values={{ distance: currentJob.viewingDistance }} 
                />
              </strong>
            </div>
          </div>
        )}
      </Rows>
    </div>
  );
}

/**
 * Individual image result card
 */
interface ImageResultCardProps {
  result: ImageAnalysisResult;
  index: number;
}

function ImageResultCard({ result, index }: ImageResultCardProps) {
  const intl = useIntl();
  const statusInfo = DPI_STATUS[result.status];

  // Map status to message IDs
  const statusLabelMap: Record<string, { defaultMessage: string; description: string }> = {
    excellent: messages.statusExcellentLabel,
    good: messages.statusGoodLabel,
    acceptable: messages.statusAcceptableLabel,
    low: messages.statusLowLabel,
    critical: messages.statusCriticalLabel,
  };

  return (
    <div className="image-result-card">
      <div className="image-result-header">
        <div className="image-thumbnail-container" style={{ width: "48px" }}>
          <ImageCard
            thumbnailUrl={result.thumbnailUrl}
            alt={intl.formatMessage(messages.imageLabel, { index: index + 1 })}
          />
        </div>
        <div className="image-info">
          <div className="image-dimensions" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FormattedMessage 
              {...messages.pixelDimensions} 
              values={{ width: result.pixelWidth, height: result.pixelHeight }} 
            />
          </div>
          <div className={`image-dpi ${result.status}`}>
            <FormattedMessage
              {...messages.dpiValueStatus}
              values={{
                emoji: <span aria-hidden="true">{statusInfo.emoji}</span>,
                dpi: result.effectiveDPI,
                label: intl.formatMessage(messages.dpiLabel),
                dash: <span aria-hidden="true">{intl.formatMessage(messages.symbolDash)}</span>,
                status: intl.formatMessage(statusLabelMap[result.status])
              }}
            />
          </div>
        </div>
      </div>
      <div className="image-result-body">
        <div className="image-recommendation">
          <FormattedMessage 
            {...((messages as any)[result.recommendationKey])} 
            values={result.recommendationValues} 
          />
        </div>
        <div
          className="text-small text-muted mt-sm"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>
            <FormattedMessage 
              {...messages.viewingDistanceLabel} 
              values={{ distance: result.viewingDistance }} 
            />
          </span>
          <span>
            <FormattedMessage 
              {...messages.printDimensionsLabel} 
              values={{ width: result.placedWidthInches, height: result.placedHeightInches }} 
            />
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Summary badge for showing overall DPI status
 */
interface DPISummaryBadgeProps {
  status: ImageAnalysisResult["status"] | null;
  count: number;
}

export function DPISummaryBadge({ status, count }: DPISummaryBadgeProps) {
  const intl = useIntl();

  if (!status || count === 0) {
    return (
      <span className="status-badge" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
        <FormattedMessage {...messages.notChecked} />
      </span>
    );
  }

  const statusInfo = DPI_STATUS[status];
  const statusLabelMap: Record<string, { defaultMessage: string; description: string }> = {
    excellent: messages.statusExcellentLabel,
    good: messages.statusGoodLabel,
    acceptable: messages.statusAcceptableLabel,
    low: messages.statusLowLabel,
    critical: messages.statusCriticalLabel,
  };

  return (
    <span className={`status-badge ${status}`}>
      <FormattedMessage 
        {...messages.dpiSummary} 
        values={{ 
          emoji: statusInfo.emoji, 
          count, 
          label: intl.formatMessage(statusLabelMap[status]) 
        }} 
      />
    </span>
  );
}
