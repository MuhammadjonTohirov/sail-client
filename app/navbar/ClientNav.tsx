"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/i18n/config";
import { useEffect, useMemo, useState, useCallback } from "react";
import { appConfig, trustedImageUrl } from "@/config";
import { getAsset } from "@/utils/assets";
import { useProfile } from "@/hooks";
import DesktopNav from "./components/DesktopNav";
import MobileNav from "./components/MobileNav";
import Image from "next/image";

export default function ClientNav() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [authed, setAuthed] = useState<boolean>(false);
  const { features } = appConfig;
  const { profile } = useProfile();

  const readAuth = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("access_token");
      setAuthed(!!token);
    } catch {
      setAuthed(false);
    }
  }, []);

  const isSearchActive = pathname.startsWith("/search");
  const isFavoritesActive = pathname.startsWith("/favorites");
  const isPostActive = pathname.startsWith("/post");

  useEffect(() => {
    readAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "profile") readAuth();
    };
    const onFocus = () => readAuth();
    const onAuthChanged = () => readAuth();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    window.addEventListener("auth-changed", onAuthChanged as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("auth-changed", onAuthChanged as any);
    };
  }, [readAuth]);

  useEffect(() => {
    readAuth();
  }, [pathname, readAuth]);

  const onAddPostClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!authed) {
      alert(t("auth.loginRequiredToPost"));
      router.push(`/auth/login`);
      return;
    }
    router.push(`/post`);
  };

  const profileName = useMemo(() => {
    if (!profile) return "";
    return profile.displayName?.trim()
      ? profile.displayName
      : profile.username || "";
  }, [profile]);

  const avatarUrl = useMemo(() => {
    if (!profile) return "";
    const source = profile.avatarUrl || profile.logoUrl || "";
    return source ? trustedImageUrl(source) : "";
  }, [profile]);

  const appLogo = getAsset("app-logo.svg");

  return (
    <header className="topbar">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "32px",
        }}
      >
        <Link href={`/`}>
          <div
            className="topbar-logo"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <img
              src={appLogo}
              alt={appConfig.name}
              style={{ height: "32px" }}
              // width={200}
              // height={32}
            />
          </div>
        </Link>

        <DesktopNav
          t={t}
          locale={locale}
          setLocale={setLocale}
          authed={authed}
          profile={profile}
          profileName={profileName}
          avatarUrl={avatarUrl}
          onAddPostClick={onAddPostClick}
          features={features}
          isSearchActive={isSearchActive}
          isFavoritesActive={isFavoritesActive}
          isPostActive={isPostActive}
        />

        <MobileNav
          t={t}
          locale={locale}
          setLocale={setLocale}
          authed={authed}
          profile={profile}
          profileName={profileName}
          avatarUrl={avatarUrl}
          onAddPostClick={onAddPostClick}
          features={features}
          isSearchActive={isSearchActive}
          isFavoritesActive={isFavoritesActive}
          isPostActive={isPostActive}
        />
      </div>
    </header>
  );
}