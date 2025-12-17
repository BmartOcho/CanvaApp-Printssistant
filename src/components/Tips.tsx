/**
 * Prepress Tips Component
 * Educational content from real prepress experience
 */

import React, { useState } from "react";
import { Button, Rows } from "@canva/app-ui-kit";
import { FormattedMessage, useIntl } from "react-intl";
import { DPI_TIPS, type DPITip } from "../data/dpi_guidelines";
import type { PrintJob } from "../data/print_specs";
import { messages } from "../i18n/messages";

interface TipCardProps {
  tip: DPITip;
  variant?: "default" | "compact";
}

export function TipCard({ tip, variant = "default" }: TipCardProps) {
  const intl = useIntl();

  const getCategoryIcon = (category: DPITip["category"]) => {
    switch (category) {
      case "general":
        return "📚";
      case "large_format":
        return "🖼️";
      case "common_mistake":
        return "⚠️";
      case "pro_tip":
        return "💡";
      default:
        return "💡";
    }
  };

  const getCategoryLabel = (category: DPITip["category"]) => {
    switch (category) {
      case "general":
        return intl.formatMessage(messages.labelLearn);
      case "large_format":
        return intl.formatMessage(messages.labelLargeFormat);
      case "common_mistake":
        return intl.formatMessage(messages.labelWatchOut);
      case "pro_tip":
        return intl.formatMessage(messages.labelProTip);
      default:
        return intl.formatMessage(messages.labelTip);
    }
  };

  if (variant === "compact") {
    return (
      <div
        className="tip-card"
        style={{ padding: "var(--space-sm)", margin: 0 }}
      >
        <div className="tip-content" style={{ fontSize: "11px" }}>
          <strong>
            <span aria-hidden="true">{getCategoryIcon(tip.category)}</span>
            <span style={{ marginLeft: "4px" }}>{tip.title}</span>
            <span aria-hidden="true">{intl.formatMessage(messages.symbolColon)}</span>
          </strong>
          <span style={{ marginLeft: "4px" }}>{tip.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tip-card">
      <div className="tip-header">
        <span className="tip-icon" aria-hidden="true">{getCategoryIcon(tip.category)}</span>
        <span className="tip-title">{tip.title}</span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          {getCategoryLabel(tip.category)}
        </span>
      </div>
      <div className="tip-content">
        <span style={{ marginRight: "4px" }} aria-hidden="true">
          {intl.formatMessage(messages.symbolBullet)}
        </span>
        {tip.content}
      </div>
    </div>
  );
}

/**
 * Contextual tips based on current job
 */
interface ContextualTipsProps {
  job: PrintJob | null;
  showCount?: number;
}

export function ContextualTips({ job, showCount = 2 }: ContextualTipsProps) {
  const tips = React.useMemo(() => {
    if (!job) {
      return DPI_TIPS.filter((t) => t.category === "general").slice(0, showCount);
    }

    const isLargeFormat = job.category === "large" || job.category === "xlarge";

    if (isLargeFormat) {
      // Prioritize large format tips
      const largeTips = DPI_TIPS.filter((t) => t.category === "large_format");
      const proTips = DPI_TIPS.filter((t) => t.id === "phone_photos" || t.id === "zoom_test");
      return [...largeTips.slice(0, 2), ...proTips.slice(0, 1)].slice(0, showCount);
    }

    // For small format, focus on quality
    const qualityTips = DPI_TIPS.filter(
      (t) =>
        t.id === "native_resolution" ||
        t.id === "web_images" ||
        t.id === "zoom_test"
    );
    return qualityTips.slice(0, showCount);
  }, [job, showCount]);

  if (tips.length === 0) return null;

  return (
    <div className="contextual-tips">
      <Rows spacing="1u">
        {tips.map((tip) => (
          <TipCard key={tip.id} tip={tip} variant="compact" />
        ))}
      </Rows>
    </div>
  );
}

/**
 * Expandable tips carousel
 */
interface TipsCarouselProps {
  category?: DPITip["category"];
}

export function TipsCarousel({ category }: TipsCarouselProps) {
  const intl = useIntl();
  const [currentIndex, setCurrentIndex] = useState(0);

  const tips = React.useMemo(() => {
    return category
      ? DPI_TIPS.filter((t) => t.category === category)
      : DPI_TIPS;
  }, [category]);

  const currentTip = tips[currentIndex];

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  if (!currentTip) return null;

  return (
    <div style={{ position: "relative" }}>
      <TipCard tip={currentTip} />
      {tips.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "var(--space-md)",
            marginTop: "var(--space-sm)",
          }}
        >
          <Button
            variant="secondary"
            onClick={prevTip}
            ariaLabel={intl.formatMessage(messages.prevTip)}
          >
            {intl.formatMessage(messages.symbolArrowLeft)}
          </Button>
          <span
            style={{ fontSize: "11px", color: "var(--text-muted)" }}
          >
            <FormattedMessage 
              {...messages.tipCounter} 
              values={{ current: currentIndex + 1, total: tips.length }} 
            />
          </span>
          <Button
            variant="secondary"
            onClick={nextTip}
            ariaLabel={intl.formatMessage(messages.nextTip)}
          >
            {intl.formatMessage(messages.symbolArrowRight)}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Large format specific education panel
 */
interface LargeFormatEducationProps {
  job: PrintJob;
}

export function LargeFormatEducation({ job }: LargeFormatEducationProps) {
  const intl = useIntl();
  if (job.category !== "large" && job.category !== "xlarge") {
    return null;
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(99, 102, 241, 0.1))",
        border: "1px solid rgba(6, 182, 212, 0.2)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-lg)",
        marginBottom: "var(--space-lg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
        <span style={{ fontSize: "20px" }} aria-hidden="true">{intl.formatMessage(messages.symbolEmojiPicture)}</span>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--print-secondary)" }}>
          <FormattedMessage {...messages.largeFormatTitle} />
        </span>
      </div>

      <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
        <p style={{ marginBottom: "var(--space-sm)" }}>
          <strong>
            <FormattedMessage {...messages.viewingDistanceFor} values={{ jobName: job.name }} />
          </strong>
          <span aria-hidden="true" style={{ marginLeft: "4px" }}>{job.viewingDistance}</span>
        </p>
        <p style={{ marginBottom: "var(--space-sm)" }}>
          <strong>
            <FormattedMessage {...messages.requiredDPI} />
          </strong>
          <span aria-hidden="true" style={{ marginLeft: "4px" }}>
            {job.minDPI}
            {intl.formatMessage(messages.symbolDash)}
            {job.recommendedDPI}
            {intl.formatMessage(messages.symbolBullet)}
            <FormattedMessage {...messages.dpiLabel} />
          </span>
          {job.minDPI < 100 && (
            <FormattedMessage {...messages.yesReallyLow} />
          )}
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>
            <FormattedMessage {...messages.whyLargeFormatTitle} />
          </strong>
          <span style={{ marginLeft: "4px" }}>
            <FormattedMessage {...messages.whyLargeFormatDesc} />
          </span>
        </p>
      </div>

      {job.notes && (
        <div
          style={{
            marginTop: "var(--space-md)",
            padding: "var(--space-sm)",
            background: "rgba(255,255,255,0.5)",
            borderRadius: "var(--radius-sm)",
            fontSize: "11px",
            color: "var(--text-primary)",
          }}
        >
          <strong>
            <span aria-hidden="true">{intl.formatMessage(messages.symbolEmojiIdea)}</span>
            <span style={{ marginLeft: "4px" }}>
              <FormattedMessage {...messages.labelPrepressNote} />
            </span>
            <span aria-hidden="true">{intl.formatMessage(messages.symbolColon)}</span>
          </strong> {job.notes}
        </div>
      )}
    </div>
  );
}
