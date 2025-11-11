"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import { appConfig, trustedImageUrl } from "@/config";
import { LogoutUseCase } from "@/domain/usecases/auth/LogoutUseCase";
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl";
import { Assets, getAsset } from "@/utils/assets";

const iconProps = { width: 22, height: 22, strokeWidth: 1.8 };
const profileIconProps = { width: 26, height: 26, strokeWidth: 1.8 };

export default function ClientNav() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const [authed, setAuthed] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { features } = appConfig;
  const [hydrated, setHydrated] = useState(false);
  const isLocaleRu = locale === 'ru';
  const readAuth = () => {
    try {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('access_token');
      const profRaw = localStorage.getItem('profile');
      setAuthed(!!token);
      if (profRaw) {
        const p = JSON.parse(profRaw);
        const dn = p.display_name && p.display_name.trim() ? p.display_name : (p.username || "");
        const imageUrl = p.avatar ?? p.logo ?? '';
        if (imageUrl.length > 0) {
          setAvatarUrl(trustedImageUrl(imageUrl));
        }
        setProfileName(dn || "");
      } else {
        setProfileName("");
      }
    } catch {
      setAuthed(false);
      setProfileName("");
    }
  };

  const isSearchActive = pathname.startsWith('/search');
  const isFavoritesActive = pathname.startsWith('/favorites');
  const isPostActive = pathname.startsWith('/post');
  const logoutUseCase = new LogoutUseCase(new AuthRepositoryImpl());

  useEffect(() => {
    setHydrated(true);
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

  useEffect(() => { setMenuOpen(false); readAuth(); }, [pathname]);

  useEffect(() => {
    if (!authed) setMenuOpen(false);
  }, [authed]);

  const onProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // if (!hydrated) return;
    if (!authed) {
      router.push(`/auth/otp`);
      return;
    }
    setMenuOpen((v) => !v);
  };

  const onAddPostClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // if (!hydrated) return;
    if (!authed) {
      alert(t('auth.loginRequiredToPost'));
      router.push(`/auth/otp`);
      return;
    }
    router.push(`/post`);
  };
  const changeLocale = (next: Locale) => {
    if (locale === next) return;
    setLocale(next);
  };
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
            <p>{appConfig.name}</p>
          </div>
        </Link>
        
        <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
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
              title={t('navFavorites')}
              aria-label={t('navFavorites')}
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
            aria-label={t('navPost')}
            title={t('navPost')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...iconProps}>
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </Link>
          
          <div className="dropdown" ref={menuRef}>
            <button
              type="button"
              className={`nav-icon nav-icon--outline nav-icon--profile${authed && menuOpen ? ' is-active' : ''}`}
              onClick={onProfileClick}
              aria-haspopup={authed ? 'menu' : undefined}
              aria-expanded={authed ? menuOpen : undefined}
              title={authed ? t('nav.profile') : t('nav.auth')}
              aria-label={authed ? t('nav.profile') : t('nav.auth')}
            >
              {authed && avatarUrl ? (
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
            >
              {t('lang.switchRU')}
            </button>
            <button
              type="button"
              className="locale-toggle"
              onClick={() => changeLocale('uz')}
              aria-current={locale === 'uz' ? 'true' : undefined}
              style={{ background: '#F9F9F9', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              {t('lang.switchUZ')}
            </button>
        </nav>
      </div>
    </header>
  );
}
