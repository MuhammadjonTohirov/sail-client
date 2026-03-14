"use client";

import React from "react";
import { usePullToRefresh } from "@/hooks/useInfiniteScroll";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  isRefreshing?: boolean;
  disabled?: boolean;
  threshold?: number;
}

export function PullToRefresh({
  children,
  onRefresh,
  isRefreshing = false,
  disabled = false,
  threshold = 80,
}: PullToRefreshProps) {
  const { containerRef, pullDistance, isPulling, shouldTrigger, progress, style } =
    usePullToRefresh({
      onRefresh,
      isRefreshing,
      threshold,
      disabled,
    });

  return (
    <div ref={containerRef} className="pull-to-refresh-container">
      <div
        className="pull-to-refresh-indicator"
        style={{
          height: pullDistance > 0 ? pullDistance : 0,
          opacity: progress,
        }}
      >
        <div
          className={`pull-to-refresh-spinner ${
            isRefreshing ? "spinning" : shouldTrigger ? "ready" : ""
          }`}
          style={{
            transform: `rotate(${progress * 360}deg)`,
          }}
        >
          {isRefreshing ? (
            <span className="spinner-icon">⟳</span>
          ) : shouldTrigger ? (
            <span className="ready-icon">↓</span>
          ) : (
            <span className="pull-icon">↓</span>
          )}
        </div>
        <span className="pull-to-refresh-text">
          {isRefreshing
            ? "Обновление..."
            : shouldTrigger
            ? "Отпустите для обновления"
            : "Потяните для обновления"}
        </span>
      </div>
      <div style={style}>{children}</div>

      <style jsx>{`
        .pull-to-refresh-container {
          position: relative;
          overflow: hidden;
        }

        .pull-to-refresh-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
          background: var(--bg);
        }

        .pull-to-refresh-spinner {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: var(--accent);
          transition: transform 0.1s ease;
        }

        .pull-to-refresh-spinner.spinning {
          animation: spin 1s linear infinite;
        }

        .pull-to-refresh-spinner.ready {
          color: var(--accent);
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .pull-to-refresh-text {
          font-size: 12px;
          color: var(--muted);
        }

        .spinner-icon {
          animation: spin 1s linear infinite;
        }

        .pull-icon {
          opacity: 0.6;
        }

        .ready-icon {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
