"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log error to console in development only
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
    // TODO: Send error to monitoring service (e.g., Sentry) in production
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h1 className="error-title">{t("error.title", "Something went wrong")}</h1>
        <p className="error-message">
          {t("error.message", "An unexpected error occurred. Please try again.")}
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <pre className="error-details">{error.message}</pre>
        )}
        <div className="error-actions">
          <button onClick={reset} className="error-button error-button-primary">
            {t("error.tryAgain", "Try again")}
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="error-button error-button-secondary"
          >
            {t("error.goHome", "Go to homepage")}
          </button>
        </div>
      </div>

      <style jsx>{`
        .error-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 24px;
        }

        .error-container {
          text-align: center;
          max-width: 480px;
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .error-title {
          font-size: 24px;
          font-weight: 600;
          color: var(--fg);
          margin: 0 0 12px;
        }

        .error-message {
          font-size: 16px;
          color: var(--muted);
          margin: 0 0 24px;
          line-height: 1.5;
        }

        .error-details {
          background: var(--color-neutral-100);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          font-size: 12px;
          color: var(--error);
          text-align: left;
          overflow-x: auto;
          margin-bottom: 24px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .error-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .error-button {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .error-button-primary {
          background: var(--accent);
          color: white;
        }

        .error-button-primary:hover {
          background: var(--accent-2);
        }

        .error-button-secondary {
          background: var(--color-neutral-100);
          color: var(--fg);
          border: 1px solid var(--border);
        }

        .error-button-secondary:hover {
          background: var(--color-neutral-200);
        }
      `}</style>
    </div>
  );
}
