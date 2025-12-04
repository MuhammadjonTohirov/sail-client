"use client";

import { useRouter } from "next/navigation";
import { Lineicons } from "@lineiconshq/react-lineicons";
import {
  Search1Outlined as Search,
  HeartOutlined as Heart,
  PlusOutlined as Plus,
  User4Outlined as User,
  Layout9Outlined as GridAlt,
  ChatBubble2Outlined as Bubble,
  Gear1Outlined as Cog,
  ExitOutlined as Exit,
} from "@lineiconshq/free-icons";
import type { UserProfile } from "@/domain/models/UserProfile";
import type { Locale } from "@/i18n/config";
import type { AppConfig } from "@/config/app.config";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl";

const iconProps = { width: 22, height: 22, strokeWidth: 1.8 };
const profileIconProps = { width: 26, height: 26, strokeWidth: 1.8 };

interface MobileMenuProps {
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
  setMobileMenuOpen: (open: boolean) => void;
}

export default function MobileMenu({
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
  setMobileMenuOpen,
}: MobileMenuProps) {
  const router = useRouter();
  const logoutUseCase = new LogoutUseCase(new AuthRepositoryImpl());

  const changeLocale = (next: Locale) => {
    if (locale === next) return;
    setLocale(next);
  };

  const isAuthenticated = authed && !!profile;

  return (
    <div className="mobile-menu">
      <nav className="mobile-menu-nav">
        <button
          className={`mobile-menu-item${isSearchActive ? " is-active" : ""}`}
          onClick={() => {
            router.push("/search");
            setMobileMenuOpen(false);
          }}
        >
          <Lineicons icon={Search} {...iconProps} />
          <span>{t("nav.search")}</span>
        </button>

        {features.enableFavorites && (
          <button
            className={`mobile-menu-item${
              isFavoritesActive ? " is-active" : ""
            }`}
            onClick={() => {
              router.push("/favorites");
              setMobileMenuOpen(false);
            }}
          >
            <Lineicons icon={Heart} {...iconProps} />
            <span>{t("nav.favorites")}</span>
          </button>
        )}

        <button
          onClick={(e) => {
            onAddPostClick(e);
            setMobileMenuOpen(false);
          }}
          className={`mobile-menu-item mobile-menu-item--accent${
            isPostActive ? " is-active" : ""
          }`}
        >
          <Lineicons icon={Plus} {...iconProps} />
          <span>{t("nav.post")}</span>
        </button>

        {isAuthenticated && (
          <>
            <div className="mobile-menu-divider" />

            <div className="mobile-menu-profile">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profileName || t("nav.profile")}
                  className="mobile-menu-avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Lineicons icon={User} {...profileIconProps} />
              )}
              <span className="mobile-menu-profile-name">
                {profileName || t("nav.profile")}
              </span>
            </div>

            <button
              className="mobile-menu-item"
              onClick={() => {
                router.push("/u/listings");
                setMobileMenuOpen(false);
              }}
            >
              <Lineicons icon={GridAlt} {...iconProps} />
              <span>{t("nav.listings")}</span>
            </button>

            <button
              className="mobile-menu-item"
              onClick={() => {
                router.push("/chat");
                setMobileMenuOpen(false);
              }}
            >
              <Lineicons icon={Bubble} {...iconProps} />
              <span>{t("nav.chats")}</span>
            </button>

            <button
              className="mobile-menu-item"
              onClick={() => {
                router.push("/u/settings");
                setMobileMenuOpen(false);
              }}
            >
              <Lineicons icon={Cog} {...iconProps} />
              <span>{t("nav.settings")}</span>
            </button>

            <div className="mobile-menu-divider" />

            <button
              className="mobile-menu-item mobile-menu-item--danger"
              onClick={() => {
                logoutUseCase.execute();
                setMobileMenuOpen(false);
                router.push("/");
              }}
            >
              <Lineicons icon={Exit} {...iconProps} />
              <span>{t("nav.logout")}</span>
            </button>
          </>
        )}

        {!authed && (
          <>
            <div className="mobile-menu-divider" />
            <button
              className="mobile-menu-item"
              onClick={() => {
                router.push("/auth/login");
                setMobileMenuOpen(false);
              }}
            >
              <Lineicons icon={User} {...profileIconProps} />
              <span>{t("nav.auth")}</span>
            </button>
          </>
        )}

        <div className="mobile-menu-divider" />

        <div className="mobile-menu-locale">
          <span className="mobile-menu-locale-label">
            {t("lang.language")}
          </span>
          <div className="mobile-menu-locale-buttons">
            <button
              type="button"
              className={`locale-toggle-mobile${
                locale === "ru" ? " is-active" : ""
              }`}
              onClick={() => {
                changeLocale("ru");
                setMobileMenuOpen(false);
              }}
              aria-current={locale === "ru" ? "true" : undefined}
            >
              {t("lang.switchRU")}
            </button>
            <button
              type="button"
              className={`locale-toggle-mobile${
                locale === "uz" ? " is-active" : ""
              }`}
              onClick={() => {
                changeLocale("uz");
                setMobileMenuOpen(false);
              }}
              aria-current={locale === "uz" ? "true" : undefined}
            >
              {t("lang.switchUZ")}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
