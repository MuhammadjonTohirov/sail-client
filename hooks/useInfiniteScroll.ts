"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface UseInfiniteScrollOptions {
  /** Callback when bottom is reached */
  onLoadMore: () => Promise<void> | void;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Distance from bottom to trigger load (px) */
  threshold?: number;
  /** Root element for intersection observer */
  root?: Element | null;
  /** Debounce delay in ms */
  debounce?: number;
}

/**
 * Hook for infinite scroll functionality
 *
 * @example
 * const { sentinelRef } = useInfiniteScroll({
 *   onLoadMore: () => fetchNextPage(),
 *   hasMore: data.hasNextPage,
 *   isLoading: isFetching,
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} />)}
 *     <div ref={sentinelRef} />
 *   </div>
 * );
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  root = null,
  debounce = 100,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastLoadTime = useRef<number>(0);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleLoadMore = useCallback(async () => {
    const now = Date.now();
    if (now - lastLoadTime.current < debounce) return;
    if (isLoading || !hasMore) return;

    lastLoadTime.current = now;
    await onLoadMore();
  }, [onLoadMore, hasMore, isLoading, debounce]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      {
        root,
        rootMargin: `0px 0px ${threshold}px 0px`,
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, root, threshold]);

  return {
    sentinelRef,
    isIntersecting,
  };
}

/**
 * Hook for pull-to-refresh on mobile
 */
export function usePullToRefresh({
  onRefresh,
  isRefreshing = false,
  threshold = 80,
  disabled = false,
}: {
  onRefresh: () => Promise<void> | void;
  isRefreshing?: boolean;
  threshold?: number;
  disabled?: boolean;
}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current || document.body;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0) return;
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || window.scrollY > 0) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        // Apply resistance
        const resistance = 0.4;
        setPullDistance(Math.min(diff * resistance, threshold * 1.5));
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold && !isRefreshing) {
        await onRefresh();
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [disabled, isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  const shouldTrigger = pullDistance >= threshold;
  const progress = Math.min(pullDistance / threshold, 1);

  return {
    containerRef,
    pullDistance,
    isPulling,
    isRefreshing,
    shouldTrigger,
    progress,
    style: {
      transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
      transition: isPulling ? "none" : "transform 0.2s ease-out",
    },
  };
}
