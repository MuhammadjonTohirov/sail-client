import type { CSSProperties } from 'react';
import { appConfig } from './app.config';

type CssVariableMap = Record<`--${string}`, string>;

const { theme } = appConfig;

/**
 * Creates CSS custom properties from the typed theme configuration.
 * These variables are attached to the <body> element so globally scoped CSS
 * can consume them without needing Tailwind or CSS-in-JS.
 */
export function buildThemeCssVariables(): CssVariableMap {
  const vars: CssVariableMap = {
    '--fg': theme.colors.neutral[900],
    '--bg': theme.colors.neutral[50],
    '--card-bg': '#ffffff',
    '--muted': theme.colors.neutral[500],
    '--border': theme.colors.neutral[200],
    '--brand': theme.colors.primary[600],
    '--accent': theme.colors.secondary[400],
    '--accent-2': theme.colors.secondary[500],
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
