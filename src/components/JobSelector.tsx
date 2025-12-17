/**
 * Job Selector Component
 * Allows users to select their target print job with categorized options
 */

import React from "react";
import { Rows } from "@canva/app-ui-kit";
import { useIntl } from "react-intl";
import {
  PRINT_JOBS,
  PRINT_CATEGORIES,
  type PrintJob,
} from "../data/print_specs";
import { messages } from "../i18n/messages";

interface JobSelectorProps {
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

export function JobSelector({ selectedJobId, onSelectJob }: JobSelectorProps) {
  const intl = useIntl();

  // Map categories to messages
  const categoryLabelMap: Record<string, { defaultMessage: string; description: string }> = {
    small: messages.categorySmallName,
    standard: messages.categoryStandardName,
    large: messages.categoryLargeName,
    xlarge: messages.categoryXlargeName,
  };

  // Group jobs by category
  const jobsByCategory = React.useMemo(() => {
    const grouped: Record<string, PrintJob[]> = {};
    for (const job of PRINT_JOBS) {
      if (!grouped[job.category]) {
        grouped[job.category] = [];
      }
      grouped[job.category].push(job);
    }
    return grouped;
  }, []);

  const categories = ["small", "standard", "large", "xlarge"] as const;

  return (
    <div className="job-selector">
      <Rows spacing="1u">
        {categories.map((category) => {
          const categoryInfo = PRINT_CATEGORIES[category];
          const jobs = jobsByCategory[category] || [];

          if (jobs.length === 0) return null;

          return (
            <div key={category} className="job-category">
              <div className="job-category-header">
                <span className="job-category-icon" aria-hidden="true">{categoryInfo.icon}</span>
                <span className="job-category-title">
                  {intl.formatMessage(categoryLabelMap[category])}
                </span>
              </div>
              <div className="job-list">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className={`job-item ${selectedJobId === job.id ? "selected" : ""}`}
                    onClick={() => onSelectJob(job.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelectJob(job.id);
                      }
                    }}
                  >
                    <span className="job-item-name">{job.name}</span>
                    <span className="job-item-size">
                      <span>{job.width}</span>
                      <span aria-hidden="true">{intl.formatMessage(messages.symbolUnitInch)}</span>
                      <span aria-hidden="true">{intl.formatMessage(messages.symbolSeparator)}</span>
                      <span>{job.height}</span>
                      <span aria-hidden="true">{intl.formatMessage(messages.symbolUnitInch)}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </Rows>
    </div>
  );
}

/**
 * Compact job display for header/navigation
 */
interface JobBadgeProps {
  job: PrintJob;
  onClick?: () => void;
}

export function JobBadge({ job, onClick }: JobBadgeProps) {
  const intl = useIntl();
  const categoryInfo = PRINT_CATEGORIES[job.category];

  return (
    <div
      className="job-badge"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        background: "var(--bg-tertiary)",
        borderRadius: "var(--radius-full)",
        fontSize: "12px",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <span aria-hidden="true">{categoryInfo.icon}</span>
      <span style={{ fontWeight: 500 }}>{job.name}</span>
      {onClick && (
        <span style={{ color: "var(--text-muted)" }} aria-hidden="true">
          {intl.formatMessage(messages.symbolPen)}
        </span>
      )}
    </div>
  );
}
