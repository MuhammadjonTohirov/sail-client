"use client";

import React, { useMemo } from "react";
import { useI18n } from "@/lib/i18n";

interface OnlineStatusProps {
  lastActiveAt?: string | Date | null;
  showDot?: boolean;
  showText?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

type StatusType = "online" | "recently" | "away" | "offline";

function getTimeAgo(date: Date, locale: string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (locale === "uz") {
    if (diffMins < 1) return "hozir";
    if (diffMins < 60) return `${diffMins} daqiqa oldin`;
    if (diffHours < 24) return `${diffHours} soat oldin`;
    if (diffDays < 7) return `${diffDays} kun oldin`;
    return date.toLocaleDateString("uz-UZ");
  }

  if (diffMins < 1) return "только что";
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return date.toLocaleDateString("ru-RU");
}

function getStatus(lastActiveAt: Date | null): StatusType {
  if (!lastActiveAt) return "offline";

  const now = new Date();
  const diffMs = now.getTime() - lastActiveAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 5) return "online";
  if (diffMins < 30) return "recently";
  if (diffMins < 60 * 24) return "away";
  return "offline";
}

/**
 * Online status indicator showing when a user was last active
 */
export function OnlineStatus({
  lastActiveAt,
  showDot = true,
  showText = true,
  className = "",
  size = "md",
}: OnlineStatusProps) {
  const { t, locale } = useI18n();

  const parsedDate = useMemo(() => {
    if (!lastActiveAt) return null;
    if (lastActiveAt instanceof Date) return lastActiveAt;
    return new Date(lastActiveAt);
  }, [lastActiveAt]);

  const status = useMemo(() => getStatus(parsedDate), [parsedDate]);

  const statusText = useMemo(() => {
    if (!parsedDate) return t("onlineStatus.unknown", "Unknown");

    switch (status) {
      case "online":
        return t("onlineStatus.online", "Online");
      case "recently":
        return t("onlineStatus.recently", "Recently active");
      case "away":
      case "offline":
        return getTimeAgo(parsedDate, locale);
      default:
        return "";
    }
  }, [parsedDate, status, t, locale]);

  const sizeClasses = {
    sm: "online-status--sm",
    md: "online-status--md",
    lg: "online-status--lg",
  };

  return (
    <div className={`online-status ${sizeClasses[size]} ${className}`}>
      {showDot && <span className={`online-status__dot online-status__dot--${status}`} />}
      {showText && <span className="online-status__text">{statusText}</span>}
      <style jsx>{`
        .online-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .online-status__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .online-status--sm .online-status__dot {
          width: 6px;
          height: 6px;
        }

        .online-status--lg .online-status__dot {
          width: 10px;
          height: 10px;
        }

        .online-status__dot--online {
          background: #22c55e;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
        }

        .online-status__dot--recently {
          background: #eab308;
          box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.2);
        }

        .online-status__dot--away {
          background: #9ca3af;
        }

        .online-status__dot--offline {
          background: #d1d5db;
        }

        .online-status__text {
          font-size: 13px;
          color: var(--muted);
          white-space: nowrap;
        }

        .online-status--sm .online-status__text {
          font-size: 11px;
        }

        .online-status--lg .online-status__text {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

/**
 * Avatar with online status badge
 */
export function AvatarWithStatus({
  avatarUrl,
  name,
  lastActiveAt,
  size = 40,
  className = "",
}: {
  avatarUrl?: string | null;
  name: string;
  lastActiveAt?: string | Date | null;
  size?: number;
  className?: string;
}) {
  const parsedDate = useMemo(() => {
    if (!lastActiveAt) return null;
    if (lastActiveAt instanceof Date) return lastActiveAt;
    return new Date(lastActiveAt);
  }, [lastActiveAt]);

  const status = useMemo(() => getStatus(parsedDate), [parsedDate]);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`avatar-with-status ${className}`} style={{ width: size, height: size }}>
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="avatar-with-status__img" />
      ) : (
        <div className="avatar-with-status__placeholder">{initials}</div>
      )}
      {lastActiveAt && (
        <span className={`avatar-with-status__badge avatar-with-status__badge--${status}`} />
      )}
      <style jsx>{`
        .avatar-with-status {
          position: relative;
          border-radius: 50%;
          overflow: visible;
        }

        .avatar-with-status__img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-with-status__placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--color-neutral-200);
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: ${size * 0.4}px;
        }

        .avatar-with-status__badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: ${Math.max(size * 0.25, 10)}px;
          height: ${Math.max(size * 0.25, 10)}px;
          border-radius: 50%;
          border: 2px solid var(--card-bg);
        }

        .avatar-with-status__badge--online {
          background: #22c55e;
        }

        .avatar-with-status__badge--recently {
          background: #eab308;
        }

        .avatar-with-status__badge--away {
          background: #9ca3af;
        }

        .avatar-with-status__badge--offline {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
