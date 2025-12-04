"use client";

import { useState, useRef, useEffect } from "react";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  XmarkOutlined as Close,
  MenuHamburger1Outlined as Menu,
} from "@lineiconshq/free-icons";
import MobileMenu from "./MobileMenu";
import type { UserProfile } from "@/domain/models/UserProfile";
import type { Locale } from "@/i18n/config";
import type { AppConfig } from "@/config/app.config";

const mobileMenuIconProps = { width: 24, height: 24, strokeWidth: 2 };

interface MobileNavProps {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  authed: boolean;
  profile: UserProfile | null;
  profileName: string;
  avatarUrl: string;
  onAddPostClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  features: AppConfig["features"];
  isSearchActive: boolean;
  isFavoritesActive: boolean;
  isPostActive: boolean;
}

export default function MobileNav({
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
}: MobileNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(e.target as Node))
        setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [authed]);

  return (
    <div className="nav-mobile" ref={mobileMenuRef}>
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={(e) => {
          e.stopPropagation();
          setMobileMenuOpen((v) => !v);
        }}
        aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? (
          <Lineicons icon={Close} {...mobileMenuIconProps} />
        ) : (
          <Lineicons icon={Menu} {...mobileMenuIconProps} />
        )}
      </button>

      {mobileMenuOpen && (
        <MobileMenu
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
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}
    </div>
  );
}
