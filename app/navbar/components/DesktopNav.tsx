"use client";

import Link from "next/link";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Search1Outlined as Search,
  HeartOutlined as Heart,
  PlusOutlined as Plus,
} from "@lineiconshq/free-icons";
import ProfileDropdown from "./ProfileDropdown";
import type { UserProfile } from "@/domain/models/UserProfile";
import type { Locale } from "@/i18n/config";
import type { AppConfig } from "@/config/app.config";

const iconProps = { width: 22, height: 22, strokeWidth: 1.8 };

interface DesktopNavProps {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  authed: boolean;
  profile: UserProfile | null;
  profileName: string;
  avatarUrl: string;
  onAddPostClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  features: AppConfig["features"];
  isSearchActive: boolean;
  isFavoritesActive: boolean;
  isPostActive: boolean;
}

export default function DesktopNav({
  t,
  locale,
  setLocale,
  authed,
  profile,
  profileName,
  avatarUrl,
  onAddPostClick,
  features,
  isSearchActive,
  isFavoritesActive,
  isPostActive,
}: DesktopNavProps) {
  const changeLocale = (next: Locale) => {
    if (locale === next) return;
    setLocale(next);
  };

  return (
    <nav className="nav-desktop">
      <Link
        href={`/search`}
        className={`nav-icon nav-icon--outline${
          isSearchActive ? " is-active" : ""
        }`}
        aria-label={t("nav.search")}
        title={t("nav.search")}
      >
        <Lineicons icon={Search} {...iconProps} />
      </Link>

      {features.enableFavorites && (
        <Link
          href={`/favorites`}
          className={`nav-icon nav-icon--outline${
            isFavoritesActive ? " is-active" : ""
          }`}
          title={t("nav.favorites")}
          aria-label={t("nav.favorites")}
        >
          <Lineicons icon={Heart} {...iconProps} />
        </Link>
      )}

      <Link
        href={`/post`}
        onClick={onAddPostClick}
        className={`nav-icon nav-icon--accent${
          isPostActive ? " is-active" : ""
        }`}
        aria-label={t("nav.post")}
        title={t("nav.post")}
      >
        <Lineicons icon={Plus} {...iconProps} />
      </Link>

      <ProfileDropdown
        t={t}
        authed={authed}
        profile={profile}
        profileName={profileName}
        avatarUrl={avatarUrl}
      />

      <span className="muted" style={{ margin: "0 6px" }}>
        |
      </span>
      <button
        type="button"
        className="locale-toggle"
        onClick={() => changeLocale("ru")}
        aria-current={locale === "ru" ? "true" : undefined}
        style={{
          background: "#F9F9F9",
          border: "none",
          color: "inherit",
          cursor: "pointer",
        }}
        suppressHydrationWarning
      >
        {t("lang.switchRU")}
      </button>
      <button
        type="button"
        className="locale-toggle"
        onClick={() => changeLocale("uz")}
        aria-current={locale === "uz" ? "true" : undefined}
        style={{
          background: "#F9F9F9",
          border: "none",
          color: "inherit",
          cursor: "pointer",
        }}
        suppressHydrationWarning
      >
        {t("lang.switchUZ")}
      </button>
    </nav>
  );
}