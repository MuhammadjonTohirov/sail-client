import type { CSSProperties } from 'react';
import { appConfig } from './app.config';

type CssVariableMap = Record<`--${string}`, string>;

const { theme } = appConfig;

function hexToRgb(hex: string): string {
  let normalized = hex.trim().replace('#', '');
  if (normalized.length === 3) {
    normalized = normalized.split('').map((c) => c + c).join('');
  }
  if (normalized.length === 8) {
    normalized = normalized.slice(0, 6);
  }
  const rgb = parseInt(normalized, 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  return `${r}, ${g}, ${b}`;
}

/**
 * Creates CSS custom properties from the typed theme configuration.
 * These variables are attached to the <body> element so globally scoped CSS
 * can consume them without needing Tailwind or CSS-in-JS.
 */
export function buildThemeCssVariables(): CssVariableMap {
  const accent = theme.colors.secondary[400];
  const accent2 = theme.colors.secondary[500];

  const vars: CssVariableMap = {
    '--fg': theme.colors.neutral[900],
    '--bg': theme.colors.neutral[50],
    '--card-bg': '#ffffff',
    '--muted': theme.colors.neutral[500],
    '--border': theme.colors.neutral[200],
    '--brand': theme.colors.primary[600],
    '--accent': accent,
    '--accent-2': accent2,
    '--accent-rgb': hexToRgb(accent),
    '--accent-2-rgb': hexToRgb(accent2),
    '--success': theme.colors.success[500],
    '--warning': theme.colors.warning[500],
    '--danger': theme.colors.error[500],
    '--radius': theme.borderRadius.medium,
    '--radius-lg': theme.borderRadius.large,
    '--radius-xl': theme.borderRadius.xl,
    '--font-sans': theme.fonts.sans,
    '--font-mono': theme.fonts.mono,
    '--container-max-width': theme.spacing.containerMaxWidth,
    '--header-height': theme.spacing.headerHeight,
    '--footer-height': theme.spacing.footerHeight,
  };

  // Primary, secondary, and neutral scales (50-900)
  for (const scale of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const) {
    vars[`--color-primary-${scale}`] = theme.colors.primary[scale];
    vars[`--color-secondary-${scale}`] = theme.colors.secondary[scale];
    vars[`--color-neutral-${scale}`] = theme.colors.neutral[scale];
    vars[`--color-success-${scale}`] = theme.colors.success[scale];
    vars[`--color-warning-${scale}`] = theme.colors.warning[scale];
    vars[`--color-error-${scale}`] = theme.colors.error[scale];
  }

  return vars;
}

/**
 * Helper for turning the CSS variables into an inline style block.
 */
export function buildThemeStyle(): CSSProperties {
  const cssVars = buildThemeCssVariables();
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(cssVars)) {
    style[key] = value;
  }
  return style as CSSProperties;
}
