"use client";
import { Auth } from '@/lib/api';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';

function RegisterPageContent() {
  const { t } = useI18n();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState<{ status?: string; debug_code?: string; login?: string } | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/search';

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus appropriate input on mount/step change
  useEffect(() => {
    const input = document.getElementById(sent ? 'code-input' : 'login-input');
    if (input) input.focus();
  }, [sent]);

  const register = async () => {
    if (!login || !password) {
      setError(t('auth.errorPhoneRequired'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.register.passwordTooShort'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.register.passwordMismatch'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const r = await Auth.register(login, password, displayName);
      setSent({ ...r, login });
      setCountdown(60);

      setTimeout(() => {
        const codeInput = document.getElementById('code-input');
        if (codeInput) codeInput.focus();
      }, 100);
    } catch (e: any) {
      setError(e.message || t('auth.register.error'));
    } finally {
      setLoading(false);
    }
  };

  const verify = async (otp?: string) => {
    const value = otp ?? code;
    if (!value || value.length !== 6) {
      setError(t('auth.register.invalidCode'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      await Auth.registerVerify(login, value, password, displayName);
      router.push(redirectTo);
    } catch (e: any) {
      setError(e.message || t('auth.register.verifyError'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (sent) {
        verify();
      } else {
        register();
      }
    }
  };

  const handleCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);

    if (cleaned.length === 6 && sent) {
      setTimeout(() => verify(cleaned), 100);
    }
  };

  const resetForm = () => {
    setSent(null);
    setCode('');
    setError('');
    setCountdown(0);
    setTimeout(() => {
      const input = document.getElementById('login-input');
      if (input) input.focus();
    }, 100);
  };

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#23E5DB] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {sent ? t('auth.register.verifyTitle') : t('auth.register.title')}
          </h1>
          <p className="text-gray-600">
            {sent ? (
              t('auth.register.verifySubtitle', { login: sent.login })
            ) : (
              <>
                {t('auth.register.subtitle')}{' '}
                <Link href="/auth/login" className="text-[#23E5DB] hover:text-[#1dd4cb] font-medium">
                  {t('auth.register.loginLink')}
                </Link>
              </>
            )}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          {!sent ? (
            // Step 1: Registration form
            <div className="space-y-4">
              <div>
                <label htmlFor="login-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.register.loginLabel')}
                </label>
                <input
                  id="login-input"
                  type="text"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('auth.register.loginPlaceholder')}
                  disabled={loading}
                  autoComplete="username"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('auth.register.loginHint')}
                </p>
              </div>

              <div>
                <label htmlFor="display-name-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.register.displayNameLabel')}
                </label>
                <input
                  id="display-name-input"
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('auth.register.displayNamePlaceholder')}
                  disabled={loading}
                  autoComplete="name"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.register.passwordLabel')}
                </label>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('auth.register.passwordHint')}
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.register.confirmPasswordLabel')}
                </label>
                <input
                  id="confirm-password-input"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
              </div>

              <button
                onClick={register}
                disabled={loading || !login || !password || !confirmPassword}
                className="w-full bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('auth.register.registering')}
                  </>
                ) : (
                  t('auth.register.submit')
                )}
              </button>
            </div>
          ) : (
            // Step 2: Verification code input
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="code-input" className="block text-sm font-semibold text-gray-700">
                    {t('auth.register.codeLabel')}
                  </label>
                  <button
                    onClick={resetForm}
                    className="text-xs text-[#23E5DB] hover:text-[#1dd4cb] font-medium"
                  >
                    {t('auth.register.changeLogin')}
                  </button>
                </div>
                <input
                  id="code-input"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={e => handleCodeChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="000000"
                  disabled={loading}
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
              </div>

              {/* Debug code in development */}
              {sent.debug_code && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-yellow-800 mb-1">
                    {t('auth.developmentMode')}
                  </p>
                  <p className="text-sm font-mono text-yellow-900">
                    {t('auth.register.debugCode')}: <span className="font-bold">{sent.debug_code}</span>
                  </p>
                </div>
              )}

              <button
                onClick={() => verify()}
                disabled={loading || code.length !== 6}
                className="w-full bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('auth.register.verifying')}
                  </>
                ) : (
                  t('auth.register.verify')
                )}
              </button>

              {/* Resend code */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    {t('auth.register.resendIn', { seconds: countdown })}
                  </p>
                ) : (
                  <button
                    onClick={register}
                    disabled={loading}
                    className="text-sm text-[#23E5DB] hover:text-[#1dd4cb] font-medium disabled:opacity-50"
                  >
                    {t('auth.register.resend')}
                  </button>
                )}
              </div>
            </div>
          )}

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

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterPageContent />
    </Suspense>
  );
}
