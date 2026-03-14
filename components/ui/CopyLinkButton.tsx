"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { useShare } from "@/hooks/useShare";
import { useToast } from "@/components/ui/Toast";

interface CopyLinkButtonProps {
  url?: string;
  title?: string;
  className?: string;
  variant?: "icon" | "button" | "text";
  showLabel?: boolean;
}

export function CopyLinkButton({
  url,
  title,
  className = "",
  variant = "button",
  showLabel = true,
}: CopyLinkButtonProps) {
  const { t } = useTranslation();
  const { success } = useToast();
  const { share, canShare, copied, isSharing } = useShare({
    onSuccess: () => success(t("toast.linkCopied", "Link copied!")),
  });

  const currentUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleClick = () => {
    share({
      title: title || document.title,
      url: currentUrl,
    });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isSharing}
        className={`copy-link-icon ${className}`}
        aria-label={t("common.share", "Share")}
        title={canShare ? t("common.share", "Share") : t("common.copyLink", "Copy link")}
      >
        {copied ? "✓" : canShare ? "↗" : "🔗"}
      </button>
    );
  }

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isSharing}
        className={`copy-link-text ${className}`}
      >
        {copied ? t("toast.copied", "Copied!") : canShare ? t("common.share", "Share") : t("common.copyLink", "Copy link")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSharing}
      className={`copy-link-button ${className}`}
    >
      <span className="copy-link-icon-wrapper">
        {copied ? "✓" : canShare ? "↗" : "🔗"}
      </span>
      {showLabel && (
        <span className="copy-link-label">
          {copied ? t("toast.copied", "Copied!") : canShare ? t("common.share", "Share") : t("common.copyLink", "Copy link")}
        </span>
      )}

      <style jsx>{`
        .copy-link-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--card-bg);
          color: var(--fg);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .copy-link-button:hover:not(:disabled) {
          background: var(--color-neutral-100);
        }

        .copy-link-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .copy-link-icon-wrapper {
          font-size: 16px;
        }

        .copy-link-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--card-bg);
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .copy-link-icon:hover:not(:disabled) {
          background: var(--color-neutral-100);
        }

        .copy-link-text {
          background: none;
          border: none;
          color: var(--accent);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
        }

        .copy-link-text:hover {
          text-decoration: underline;
        }
      `}</style>
    </button>
  );
}
