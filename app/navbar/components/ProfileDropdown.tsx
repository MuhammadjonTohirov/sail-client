"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { User4Outlined as User } from "@lineiconshq/free-icons";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl";
import type { UserProfile } from "@/domain/models/UserProfile";
import Image from "next/image";

const profileIconProps = { width: 26, height: 26, strokeWidth: 1.8 };

interface ProfileDropdownProps {
  t: (key: string) => string;
  authed: boolean;
  profile: UserProfile | null;
  profileName: string;
  avatarUrl: string;
}

export default function ProfileDropdown({
  t,
  authed,
  profile,
  profileName,
  avatarUrl,
}: ProfileDropdownProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const logoutUseCase = new LogoutUseCase(new AuthRepositoryImpl());

  const onProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!authed) {
      router.push(`/auth/login`);
      return;
    }
    setMenuOpen((v) => !v);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!authed) {
      setMenuOpen(false);
    }
  }, [authed]);

  const isAuthenticated = authed && !!profile;

  return (
    <div className="dropdown" ref={menuRef}>
      <button
        type="button"
        className={`nav-icon nav-icon--outline nav-icon--profile${
          isAuthenticated && menuOpen ? " is-active" : ""
        }`}
        onClick={onProfileClick}
        aria-haspopup={authed ? "menu" : undefined}
        aria-expanded={authed ? menuOpen : undefined}
        title={authed ? t("nav.profile") : t("nav.auth")}
        aria-label={authed ? t("nav.profile") : t("nav.auth")}
      >
        {isAuthenticated && avatarUrl ? (
          <img
            src={avatarUrl}
            alt={profileName || t("nav.profile")}
            className="nav-profile-avatar"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Lineicons icon={User} {...profileIconProps} />
        )}
      </button>
      {authed && menuOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="menu-header">{profileName || t("nav.profile")}</div>

          <button
            className="menu-item"
            onClick={() => {
              router.push("/u/listings");
              setMenuOpen(false);
            }}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: 0,
            }}
          >
            {t("nav.listings")}
          </button>

          <button
            className="menu-item"
            onClick={() => {
              router.push("/chat");
              setMenuOpen(false);
            }}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: 0,
            }}
          >
            {t("nav.chats")}
          </button>

          <button
            className="menu-item"
            onClick={() => {
              router.push("/u/settings");
              setMenuOpen(false);
            }}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: 0,
            }}
          >
            {t("nav.settings")}
          </button>
          <div className="menu-sep" />
          <button
            className="menu-item"
            onClick={() => {
              logoutUseCase.execute();
              setMenuOpen(false);
              router.push("/");
            }}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: 0,
            }}
          >
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}