"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  animate?: boolean;
}

export function Skeleton({
  className = "",
  width,
  height,
  borderRadius = 8,
  animate = true,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${animate ? "skeleton-animate" : ""} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
      }}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 && lines > 1 ? "70%" : "100%"}
          borderRadius={4}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton className="skeleton-card-image" height={180} borderRadius="8px 8px 0 0" />
      <div className="skeleton-card-content">
        <Skeleton height={20} width="60%" borderRadius={4} />
        <Skeleton height={24} width="40%" borderRadius={4} />
        <SkeletonText lines={2} />
        <div className="skeleton-card-meta">
          <Skeleton height={12} width="30%" borderRadius={4} />
          <Skeleton height={12} width="25%" borderRadius={4} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="skeleton-list-item">
      <Skeleton width={80} height={80} borderRadius={8} />
      <div className="skeleton-list-item-content">
        <Skeleton height={18} width="70%" borderRadius={4} />
        <Skeleton height={16} width="30%" borderRadius={4} />
        <Skeleton height={14} width="50%" borderRadius={4} />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius="50%" />;
}

export function SkeletonButton({ width = 100 }: { width?: number | string }) {
  return <Skeleton width={width} height={40} borderRadius={8} />;
}

// Grid of skeleton cards
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
