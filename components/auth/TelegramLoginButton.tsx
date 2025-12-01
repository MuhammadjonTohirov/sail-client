"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { appConfig } from '@/config/app.config';
import { Auth } from '@/lib/authApi';
import { useI18n } from '@/lib/i18n';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

interface TelegramLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function TelegramLoginButton({ onSuccess, onError }: TelegramLoginButtonProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const redirectTo = searchParams.get('redirect') || '/search';

  useEffect(() => {
    if (!appConfig.telegram.enabled || !appConfig.telegram.botUsername) {
      console.warn('Telegram login not configured');
      return;
    }

    console.log('TelegramLoginButton mounted', {
      botUsername: appConfig.telegram.botUsername,
      currentDomain: typeof window !== 'undefined' ? window.location.host : 'N/A'
    });

    // Define callback function
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram auth callback received:', user);
      setLoading(true);
      setError('');

      try {
        await Auth.telegram(user);
        onSuccess?.();
        router.push(redirectTo);
      } catch (e: any) {
        const errorMsg = e.message || t('auth.telegram.error');
        console.error('Telegram auth error:', errorMsg, e);
        setError(errorMsg);
        onError?.(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    // Render button immediately
    renderTelegramButton();

    return () => {
      // Cleanup
      if (window.onTelegramAuth) {
        delete window.onTelegramAuth;
      }
    };
  }, []);

  const renderTelegramButton = () => {
    if (!containerRef.current || !appConfig.telegram.botUsername) {
      console.error('Cannot render Telegram button:', {
        hasContainer: !!containerRef.current,
        botUsername: appConfig.telegram.botUsername
      });
      return;
    }

    console.log('Rendering Telegram button with username:', appConfig.telegram.botUsername);

    // Clear existing content
    containerRef.current.innerHTML = '';

    // Create Telegram login button script element
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', appConfig.telegram.botUsername);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('strategy', 'lazyOnload')
    script.async = true;

    containerRef.current.appendChild(script);

    console.log('Telegram button script element added to DOM');
  };

  if (!appConfig.telegram.enabled) {
    return null;
  }

  return (
    <div className="telegram-login-wrapper w-full">
      <div
        ref={containerRef}
        className="flex justify-center items-center min-h-[46px] w-full"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Bot: {appConfig.telegram.botUsername} | Domain: {typeof window !== 'undefined' ? window.location.host : 'loading...'}
        </div>
      )}

      {loading && (
        <div className="text-center mt-2 text-sm text-gray-600">
          <svg className="animate-spin inline-block w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('auth.telegram.connecting')}
        </div>
      )}

      {error && (
        <div className="mt-2 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <style jsx global>{`
        /* Ensure Telegram widget iframe is visible */
        iframe[src*="telegram.org"] {
          display: block !important;
          margin: 0 auto !important;
          border: none !important;
          overflow: hidden !important;
        }

        /* Telegram button container */
        .telegram-login-wrapper {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
