"use client";

import React from "react";
import { ToastProvider } from "@/components/ui/Toast";
import { KeyboardShortcutsHelp } from "@/components/ui/KeyboardShortcutsHelp";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function KeyboardShortcutsWrapper({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();
  return <>{children}</>;
}

/**
 * Client-side providers that need to be at the app level
 * - Toast notifications
 * - Keyboard shortcuts
 * - Scroll to top button
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <KeyboardShortcutsWrapper>
        {children}
        <KeyboardShortcutsHelp />
        <ScrollToTop />
      </KeyboardShortcutsWrapper>
    </ToastProvider>
  );
}
