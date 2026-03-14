"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ShortcutConfig {
  enabled?: boolean;
}

/**
 * Hook for global keyboard shortcuts
 *
 * Shortcuts:
 * - Cmd/Ctrl + K: Focus search
 * - Cmd/Ctrl + P: Go to post new listing
 * - Cmd/Ctrl + H: Go to home
 * - Cmd/Ctrl + F: Go to favorites
 * - Cmd/Ctrl + M: Go to my listings
 * - Escape: Close modals/overlays
 */
export function useKeyboardShortcuts(config: ShortcutConfig = {}) {
  const { enabled = true } = config;
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Only allow Escape in inputs
        if (e.key !== "Escape") return;
      }

      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + K: Focus search
      if (isMod && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          'input[type="search"], input[placeholder*="ищу"], input[placeholder*="search"]'
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          router.push("/search");
        }
        return;
      }

      // Cmd/Ctrl + P: Post new listing
      if (isMod && e.key === "p") {
        e.preventDefault();
        router.push("/post");
        return;
      }

      // Cmd/Ctrl + H: Home
      if (isMod && e.key === "h") {
        e.preventDefault();
        router.push("/");
        return;
      }

      // Cmd/Ctrl + F: Favorites (when not in input)
      if (isMod && e.key === "f" && target.tagName !== "INPUT") {
        e.preventDefault();
        router.push("/favorites");
        return;
      }

      // Cmd/Ctrl + M: My listings
      if (isMod && e.key === "m") {
        e.preventDefault();
        router.push("/u/listings");
        return;
      }

      // Escape: Close modals or blur inputs
      if (e.key === "Escape") {
        // Try to close any open modal
        const closeButton = document.querySelector<HTMLButtonElement>(
          '[data-dismiss="modal"], .modal-close, [aria-label="Close"]'
        );
        if (closeButton) {
          closeButton.click();
          return;
        }
        // Blur any focused input
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        return;
      }

      // ? : Show keyboard shortcuts help (Shift + /)
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        // Dispatch custom event for help modal
        window.dispatchEvent(new CustomEvent("show-shortcuts-help"));
        return;
      }
    },
    [router]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}

// Shortcuts help data for displaying in UI
export const KEYBOARD_SHORTCUTS = [
  { keys: ["⌘", "K"], description: "shortcuts.search" },
  { keys: ["⌘", "P"], description: "shortcuts.post" },
  { keys: ["⌘", "H"], description: "shortcuts.home" },
  { keys: ["⌘", "F"], description: "shortcuts.favorites" },
  { keys: ["⌘", "M"], description: "shortcuts.myListings" },
  { keys: ["Esc"], description: "shortcuts.close" },
  { keys: ["?"], description: "shortcuts.help" },
];
