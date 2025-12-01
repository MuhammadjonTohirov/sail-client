import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import ClientNav from "./navbar/ClientNav";
import Footer from "@/components/layout/Footer";
import CurrencyProvider from "@/components/providers/CurrencyProvider";
import I18nProvider from "@/components/providers/I18nProvider";
import ActiveStatusProvider from "@/components/providers/ActiveStatusProvider";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { appConfig, buildThemeStyle } from "@/config";
import { cookies } from "next/headers";
import { Locale } from "@/i18n/config";
import { ProfileProvider } from "@/components/providers/ProfileProvider";
// import type { Locale } from '@/i18n/config';
// import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: {
    default: appConfig.seo.defaultTitle,
    template: appConfig.seo.titleTemplate,
  },
  description: appConfig.seo.description,
  keywords: [...appConfig.seo.keywords],
  applicationName: appConfig.name,
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-64x64.png", type: "image/png", sizes: "64x64" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
  },
  other: {
    tagline: appConfig.tagline,
  },
};

const bodyStyle = {
  ...buildThemeStyle(),
  fontFamily: "var(--font-sans)",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "var(--bg)",
} as React.CSSProperties;

const supportedLocales: Locale[] = ["ru", "uz"];
const fallbackLocale: Locale = supportedLocales.includes(
  appConfig.i18n.defaultLocale as Locale
)
  ? (appConfig.i18n.defaultLocale as Locale)
  : "ru";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get("locale");
  const initialLocale =
    localeCookie && supportedLocales.includes(localeCookie.value as Locale)
      ? (localeCookie.value as Locale)
      : fallbackLocale;
  return (
    <html lang={initialLocale}>
      <body style={bodyStyle}>
        <I18nProvider initialLocale={initialLocale}>
          <CurrencyProvider>
            <ActiveStatusProvider>
              <ProfileProvider>
                <FavoritesProvider>
                  <ClientNav />
                  <main className="container page-content">{children}</main>
                  <Footer />
                </FavoritesProvider>
              </ProfileProvider>
            </ActiveStatusProvider>
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
