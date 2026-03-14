"use client";

import React, { useState, useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  fallbackElement?: React.ReactNode;
  showSkeleton?: boolean;
  blurDataURL?: string;
}

const DEFAULT_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBRIhBhMiMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAYEQADAQEAAAAAAAAAAAAAAAAAAQIDEf/aAAwDAQACEQMRAD8Av6bqem3WoafZz6jFFMtzHuRnAZRuHBH8q/1T0HTNT1S91C00+3hvJJ3YSJGFcZOQQR+0pSoVlhf/2Q==";

/**
 * Image component with:
 * - Lazy loading
 * - Blur placeholder
 * - Error fallback
 * - Skeleton loading state
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/assets/placeholder.svg",
  fallbackElement,
  showSkeleton = true,
  blurDataURL = DEFAULT_BLUR,
  className = "",
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  if (hasError && fallbackElement) {
    return <>{fallbackElement}</>;
  }

  return (
    <div className={`image-wrapper ${className}`} style={{ position: "relative" }}>
      {showSkeleton && isLoading && (
        <div
          className="image-skeleton skeleton-animate"
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-neutral-100)",
            borderRadius: "inherit",
          }}
        />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          if (fallbackSrc && imgSrc !== fallbackSrc) {
            setImgSrc(fallbackSrc);
          }
        }}
        style={{
          ...props.style,
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}

/**
 * Lazy image that loads when in viewport
 */
export function LazyImage({
  src,
  alt,
  className = "",
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lazy-image ${className}`}
      style={{
        width,
        height,
        background: "var(--color-neutral-100)",
        overflow: "hidden",
        ...props.style,
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}
    </div>
  );
}
