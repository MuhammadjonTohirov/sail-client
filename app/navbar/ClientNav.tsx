"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/i18n/config";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { appConfig, trustedImageUrl } from "@/config";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl";
import { getAsset } from "@/utils/assets";
import { useProfile } from "@/hooks";

const iconProps = { width: 22, height: 22, strokeWidth: 1.8 };
const profileIconProps = { width: 26, height: 26, strokeWidth: 1.8 };
const mobileMenuIconProps = { width: 24, height: 24, strokeWidth: 2 };

export default function ClientNav() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [authed, setAuthed] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const { features } = appConfig;
  const { profile, getProfile } = useProfile();

  const readAuth = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("access_token");
      setAuthed(!!token);
    } catch {
      setAuthed(false);
    }
  }, []);

  const isSearchActive = pathname.startsWith('/search');
  const isFavoritesActive = pathname.startsWith('/favorites');
  const isPostActive = pathname.startsWith('/post');
  const logoutUseCase = new LogoutUseCase(new AuthRepositoryImpl());

  useEffect(() => {
    readAuth();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'profile') readAuth();
    };
    const onFocus = () => readAuth();
    const onAuthChanged = () => readAuth();
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    window.addEventListener('auth-changed', onAuthChanged as any);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('auth-changed', onAuthChanged as any);
    };
  }, []);

  // Close dropdown when clicking outside or navigating
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileMenuOpen(false);
    readAuth();
  }, [pathname, readAuth]);

  useEffect(() => {
    if (!authed) {
      setMenuOpen(false);
      setMobileMenuOpen(false);
    }
  }, [authed]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(e.target as Node)) setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener('click', onClick);
      return () => document.removeEventListener('click', onClick);
    }
  }, [mobileMenuOpen]);

  const onProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // if (!hydrated) return;
    if (!authed) {
      router.push(`/auth/login`);
      return;
    }
    setMenuOpen((v) => !v);
  };

  const onAddPostClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // if (!hydrated) return;
    if (!authed) {
      alert(t('auth.loginRequiredToPost'));
      router.push(`/auth/login`);
      return;
    }
    router.push(`/post`);
  };
  const changeLocale = (next: Locale) => {
    if (locale === next) return;
    setLocale(next);
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

  const isAuthenticated = authed && !!profile;

  const appLogo = getAsset('app-logo.svg')
  return (
    <header className="topbar">
      <div className="container" style={
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '32px'
          }
        }>

        <Link href={`/`}>
          <div className="topbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={appLogo} alt={appConfig.name} style={{height: '32px'}} />
            {/* <p>{appConfig.name}</p> */}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          
          <Link
            href={`/search`}
            className={`nav-icon nav-icon--outline${isSearchActive ? ' is-active' : ''}`}
            aria-label={t('nav.search')}
            title={t('nav.search')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
              <circle cx="11" cy="11" r="6" />
              <path d="m17 17 4 4" />
            </svg>
          </Link>

          {/* Favorites Link with Heart Icon */}
          {features.enableFavorites && (
            <Link
              href={`/favorites`}
              className={`nav-icon nav-icon--outline${isFavoritesActive ? ' is-active' : ''}`}
              title={t('nav.favorites')}
              aria-label={t('nav.favorites')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>
          )}

          <Link
            href={`/post`}
            onClick={onAddPostClick}
            className={`nav-icon nav-icon--accent${isPostActive ? ' is-active' : ''}`}
            aria-label={t('nav.post')}
            title={t('nav.post')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </Link>
          
          <div className="dropdown" ref={menuRef}>
            <button
              type="button"
              className={`nav-icon nav-icon--outline nav-icon--profile${isAuthenticated && menuOpen ? ' is-active' : ''}`}
              onClick={onProfileClick}
              aria-haspopup={authed ? 'menu' : undefined}
              aria-expanded={authed ? menuOpen : undefined}
              title={authed ? t('nav.profile') : t('nav.auth')}
              aria-label={authed ? t('nav.profile') : t('nav.auth')}
            >
              {isAuthenticated && avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profileName || t('nav.profile')}
                  className="nav-profile-avatar"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...profileIconProps}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </button>
            {authed && menuOpen && (
              <div className="dropdown-menu" role="menu">
                <div className="menu-header">{profileName || t('nav.profile')}</div>

                  <button className="menu-item" onClick={() => { router.push('/u/listings'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 0 }}>
                    {t('nav.listings')}
                  </button>

                  <button className="menu-item" onClick={() => { router.push('/chat'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 0 }}>
                    {t('nav.chats')}
                  </button>

                  <button className="menu-item" onClick={() => { router.push('/u/settings'); setMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 0 }}>
                    {t('nav.settings')}
                  </button>
                  <div className="menu-sep" />
                    <button className="menu-item" onClick={() => { logoutUseCase.execute(); setMenuOpen(false); router.push('/'); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 0 }}>
                      {t('nav.logout')}
                    </button>
                  </div>
            )}
            </div>
          <span className="muted" style={{ margin: '0 6px' }}>|</span>
          <button
              type="button"
              className="locale-toggle"
              onClick={() => changeLocale('ru')}
              aria-current={locale === 'ru' ? 'true' : undefined}
              style={{ background: '#F9F9F9', border: 'none', color: 'inherit', cursor: 'pointer' }}
              suppressHydrationWarning
            >
              {t('lang.switchRU')}
            </button>
            <button
              type="button"
              className="locale-toggle"
              onClick={() => changeLocale('uz')}
              aria-current={locale === 'uz' ? 'true' : undefined}
              style={{ background: '#F9F9F9', border: 'none', color: 'inherit', cursor: 'pointer' }}
              suppressHydrationWarning
            >
              {t('lang.switchUZ')}
            </button>
        </nav>

        {/* Mobile Navigation - Hamburger Menu */}
        <div className="nav-mobile" ref={mobileMenuRef}>
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen((v) => !v);
            }}
            aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...mobileMenuIconProps}>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...mobileMenuIconProps}>
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </svg>
            )}
          </button>

          {mobileMenuOpen && (
            <div className="mobile-menu">
              <nav className="mobile-menu-nav">
                <button
                  className={`mobile-menu-item${isSearchActive ? ' is-active' : ''}`}
                  onClick={() => {
                    router.push('/search');
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
                    <circle cx="11" cy="11" r="6" />
                    <path d="m17 17 4 4" />
                  </svg>
                  <span>{t('nav.search')}</span>
                </button>

                {features.enableFavorites && (
                  <button
                    className={`mobile-menu-item${isFavoritesActive ? ' is-active' : ''}`}
                    onClick={() => {
                      router.push('/favorites');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{t('nav.favorites')}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (!authed) {
                      alert(t('auth.loginRequiredToPost'));
                      router.push('/auth/login');
                    } else {
                      router.push('/post');
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`mobile-menu-item mobile-menu-item--accent${isPostActive ? ' is-active' : ''}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  <span>{t('nav.post')}</span>
                </button>

                {authed && isAuthenticated && (
                  <>
                    <div className="mobile-menu-divider" />

                    <div className="mobile-menu-profile">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profileName || t('nav.profile')}
                          className="mobile-menu-avatar"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...profileIconProps}>
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                        </svg>
                      )}
                      <span className="mobile-menu-profile-name">{profileName || t('nav.profile')}</span>
                    </div>

                    <button
                      className="mobile-menu-item"
                      onClick={() => {
                        router.push('/u/listings');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      <span>{t('nav.listings')}</span>
                    </button>

                    <button
                      className="mobile-menu-item"
                      onClick={() => {
                        router.push('/chat');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{t('nav.chats')}</span>
                    </button>

                    <button
                      className="mobile-menu-item"
                      onClick={() => {
                        router.push('/u/settings');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6m0 6v6m9.66-9.66l-4.24 4.24m-6.83 0L5.34 9.34m13.32 0l-4.24 4.24m-6.83 0L2.34 18.66" strokeWidth="1.5" />
                      </svg>
                      <span>{t('nav.settings')}</span>
                    </button>

                    <div className="mobile-menu-divider" />

                    <button
                      className="mobile-menu-item mobile-menu-item--danger"
                      onClick={() => {
                        logoutUseCase.execute();
                        setMobileMenuOpen(false);
                        router.push('/');
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>{t('nav.logout')}</span>
                    </button>
                  </>
                )}

                {!authed && (
                  <>
                    <div className="mobile-menu-divider" />
                    <button
                      className="mobile-menu-item"
                      onClick={() => {
                        router.push('/auth/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...profileIconProps}>
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                      <span>{t('nav.auth')}</span>
                    </button>
                  </>
                )}

                <div className="mobile-menu-divider" />

                <div className="mobile-menu-locale">
                  <span className="mobile-menu-locale-label">{t('lang.language')}</span>
                  <div className="mobile-menu-locale-buttons">
                    <button
                      type="button"
                      className={`locale-toggle-mobile${locale === 'ru' ? ' is-active' : ''}`}
                      onClick={() => {
                        changeLocale('ru');
                        setMobileMenuOpen(false);
                      }}
                      aria-current={locale === 'ru' ? 'true' : undefined}
                    >
                      {t('lang.switchRU')}
                    </button>
                    <button
                      type="button"
                      className={`locale-toggle-mobile${locale === 'uz' ? ' is-active' : ''}`}
                      onClick={() => {
                        changeLocale('uz');
                        setMobileMenuOpen(false);
                      }}
                      aria-current={locale === 'uz' ? 'true' : undefined}
                    >
                      {t('lang.switchUZ')}
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
