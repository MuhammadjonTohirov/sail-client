'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Auth } from '@/lib/authApi';
// import { useTranslation } from '@/components/providers/I18nProvider';
import { useI18n } from '@/lib/i18n';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { t } = useI18n();
  const codeInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [login, setLogin] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [debugCode, setDebugCode] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (step === 'reset' && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await Auth.forgotPassword(login);

      if (response.debug_code) {
        setDebugCode(response.debug_code);
      }

      setStep('reset');
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || t('auth.forgotPassword.requestError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.forgotPassword.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('auth.forgotPassword.passwordTooShort'));
      return;
    }

    if (code.length !== 6) {
      setError(t('auth.forgotPassword.invalidCode'));
      return;
    }

    setIsLoading(true);

    try {
      await Auth.resetPassword(login, code, password);

      router.push('/auth/login?reset=success');
    } catch (err: any) {
      setError(err.message || t('auth.forgotPassword.resetError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await Auth.forgotPassword(login);

      if (response.debug_code) {
        setDebugCode(response.debug_code);
      }

      setCountdown(60);
      setCode('');
    } catch (err: any) {
      setError(err.message || t('auth.forgotPassword.resendError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLogin = () => {
    setStep('request');
    setCode('');
    setPassword('');
    setConfirmPassword('');
    setDebugCode('');
    setError('');
  };

  const renderRequestForm = (
    <form className="space-y-4" onSubmit={handleRequest}>
      <div>
        <label htmlFor="login" className="block text-sm font-semibold text-gray-700 mb-2">
          {t('auth.forgotPassword.loginLabel')}
        </label>
        <input
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          required
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
          placeholder={t('auth.forgotPassword.loginPlaceholder')}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-2">{t('auth.forgotPassword.loginHint')}</p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !login}
        className="w-full bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('auth.forgotPassword.requesting')}
          </>
        ) : (
          t('auth.forgotPassword.requestSubmit')
        )}
      </button>

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
    </form>
  );

  const renderResetForm = (
    <form className="space-y-4" onSubmit={handleReset}>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
              {t('auth.forgotPassword.codeLabel')}
            </label>
            <button
              type="button"
              onClick={handleChangeLogin}
              className="text-xs text-[#23E5DB] hover:text-[#1dd4cb] font-medium"
            >
              {t('auth.forgotPassword.changeLogin')}
            </button>
          </div>
          <input
            ref={codeInputRef}
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
            placeholder="000000"
            value={code}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setCode(val);
            }}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            {t('auth.forgotPassword.resetSubtitle', { login })}
          </p>
        </div>

        {/* Debug code in development */}
        {debugCode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-medium text-yellow-800 mb-1">
              {t('auth.developmentMode')}
            </p>
            <p className="text-sm font-mono text-yellow-900">
              {t('auth.forgotPassword.debugCode')} <span className="font-bold">{debugCode}</span>
            </p>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('auth.forgotPassword.newPasswordLabel')}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
            placeholder={t('auth.forgotPassword.newPasswordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-2">{t('auth.forgotPassword.passwordHint')}</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            {t('auth.forgotPassword.confirmPasswordLabel')}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
            placeholder={t('auth.forgotPassword.confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || code.length !== 6 || !password || !confirmPassword}
        className="w-full bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('auth.forgotPassword.resetting')}
          </>
        ) : (
          t('auth.forgotPassword.resetSubmit')
        )}
      </button>

      {/* Resend code */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-gray-500">
            {t('auth.forgotPassword.resendIn', { seconds: countdown })}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-sm text-[#23E5DB] hover:text-[#1dd4cb] font-medium disabled:opacity-50"
          >
            {t('auth.forgotPassword.resend')}
          </button>
        )}
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
    </form>
  );

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#23E5DB] rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'request'
              ? t('auth.forgotPassword.title')
              : t('auth.forgotPassword.resetTitle')}
          </h1>
          <p className="text-gray-600">
            {step === 'request'
              ? t('auth.forgotPassword.subtitle')
              : t('auth.forgotPassword.resetSubtitle', { login })}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          {step === 'request' ? renderRequestForm : renderResetForm}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          {step === 'request' ? (
            <Link href="/auth/login" className="text-[#23E5DB] hover:text-[#1dd4cb] font-medium">
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          ) : (
            <button
              onClick={handleChangeLogin}
              className="text-[#23E5DB] hover:text-[#1dd4cb] font-medium"
            >
              {t('auth.forgotPassword.changeLogin')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
