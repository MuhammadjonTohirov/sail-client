"use client";
import { Auth } from '@/lib/api';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { TelegramLoginButton } from '@/components/auth/TelegramLoginButton';
import { appConfig } from '@/config/app.config';

function LoginPageContent() {
  const { t } = useI18n();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/search';

  // Auto-focus login input on mount
  useEffect(() => {
    const input = document.getElementById('login-input');
    if (input) input.focus();
  }, []);

  const handleSubmit = async () => {
    if (!login || !password) {
      setError(t('auth.errorPhoneRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      await Auth.login(login, password);
      router.push(redirectTo);
    } catch (e: any) {
      setError(e.message || t('auth.login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.login.title')}
          </h1>
          <p className="text-gray-600">
            {t('auth.login.subtitle')}{' '}
            <Link href="/auth/register" className="text-accent hover:text-accent-2 font-medium">
              {t('auth.login.registerLink')}
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="login-input" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('auth.login.loginLabel')}
              </label>
              <input
                id="login-input"
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('auth.login.loginPlaceholder')}
                disabled={loading}
                autoComplete="username"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('auth.login.passwordLabel')}
              </label>
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('auth.login.passwordPlaceholder')}
                disabled={loading}
                autoComplete="current-password"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-opacity-20 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                href="/auth/forgot-password"
                className="text-accent hover:text-accent-2 font-medium"
              >
                {t('auth.login.forgotPassword')}
              </Link>
              {/* <Link
                href="/auth/otp"
                className="text-accent hover:text-accent-2 font-medium"
              >
                {t('auth.login.useOtp')}
              </Link> */}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !login || !password}
              className="w-full bg-accent hover:bg-accent-2 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.login.loggingIn')}
                </>
              ) : (
                t('auth.login.submit')
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Telegram Login */}
        {appConfig.telegram.enabled && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="text-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('auth.or')}</span>
                </div>
              </div>
            </div>
            <TelegramLoginButton
              onSuccess={() => router.push(redirectTo)}
              onError={setError}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          {t('auth.termsMessage')}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {t('auth.loading')}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
