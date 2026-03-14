"use client";

import { useState, useCallback } from "react";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface UseShareOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  fallbackCopy?: boolean;
}

/**
 * Hook for native sharing functionality
 *
 * Uses Web Share API when available, falls back to clipboard copy
 *
 * @example
 * const { share, canShare, isSharing, copied } = useShare();
 *
 * <button onClick={() => share({ title: 'Check this out!', url: window.location.href })}>
 *   Share
 * </button>
 */
export function useShare(options: UseShareOptions = {}) {
  const { onSuccess, onError, fallbackCopy = true } = options;
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  const canCopy = typeof navigator !== "undefined" && !!navigator.clipboard;

  const copyToClipboard = useCallback(
    async (text: string) => {
      if (!canCopy) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          onSuccess?.();
          return true;
        } catch {
          return false;
        } finally {
          document.body.removeChild(textArea);
        }
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onSuccess?.();
        return true;
      } catch (err) {
        onError?.(err as Error);
        return false;
      }
    },
    [canCopy, onSuccess, onError]
  );

  const share = useCallback(
    async (data: ShareData) => {
      if (isSharing) return false;

      setIsSharing(true);

      try {
        if (canShare) {
          await navigator.share(data);
          onSuccess?.();
          return true;
        }

        // Fallback to clipboard
        if (fallbackCopy && data.url) {
          return await copyToClipboard(data.url);
        }

        return false;
      } catch (err) {
        // User cancelled share - not an error
        if ((err as Error).name === "AbortError") {
          return false;
        }
        onError?.(err as Error);
        return false;
      } finally {
        setIsSharing(false);
      }
    },
    [canShare, isSharing, fallbackCopy, copyToClipboard, onSuccess, onError]
  );

  const shareUrl = useCallback(
    async (url: string, title?: string) => {
      return share({ url, title, text: title });
    },
    [share]
  );

  return {
    share,
    shareUrl,
    copyToClipboard,
    canShare,
    canCopy,
    isSharing,
    copied,
  };
}
