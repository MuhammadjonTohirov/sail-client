import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import ClientNav from './navbar/ClientNav';
import Footer from '@/components/layout/Footer';
import CurrencyProvider from '@/components/providers/CurrencyProvider';
import I18nProvider from '@/components/providers/I18nProvider';
import ActiveStatusProvider from '@/components/providers/ActiveStatusProvider';
import { appConfig, buildThemeStyle } from '@/config';

export const metadata: Metadata = {
  title: {
    default: appConfig.seo.defaultTitle,
    template: appConfig.seo.titleTemplate,
  },
  description: appConfig.seo.description,
  keywords: [...appConfig.seo.keywords],
  applicationName: appConfig.name,
  other: {
    'tagline': appConfig.tagline,
  },
};

const bodyStyle = {
  ...buildThemeStyle(),
  fontFamily: 'var(--font-sans)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg)',
} as React.CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={appConfig.i18n.defaultLocale}>
      <body style={bodyStyle}>
        <I18nProvider>
          <CurrencyProvider>
            <ActiveStatusProvider>
              <ClientNav />
              <main className="container page-content">{children}</main>
              <Footer />
            </ActiveStatusProvider>
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
