"use client";
import { Auth } from '@/lib/api';
import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

function OTPPageContent() {
  const { t } = useI18n();
  const [phone, setPhone] = useState('+998');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState<{ status?: string; debug_code?: string } | null>(null);
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

  // Auto-focus phone input on mount
  useEffect(() => {
    const input = document.getElementById('phone-input');
    if (input) input.focus();
  }, []);

  const request = async () => {
    if (!phone || phone.length < 10) {
      setError(t('auth.errorPhoneRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      const r = await Auth.requestOtp(phone);
      setSent(r);
      setCountdown(60); // Start 60 second countdown

      // Auto-focus code input after sending
      setTimeout(() => {
        const codeInput = document.getElementById('code-input');
        if (codeInput) codeInput.focus();
      }, 100);
    } catch (e: any) {
      setError(e.message || t('auth.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const verify = async (otp?: string) => {
    const value = otp ?? code;
    console.log('Verifying code:', value);

    if (!value || value.length !== 6) {
      setError(t('auth.errorCodeRequired'));
      return;
    }

    setError('');
    setLoading(true);

    try {
      await Auth.verifyOtp(phone, value);
      router.push(redirectTo);
    } catch (e: any) {
      setError(e.message || t('auth.errorInvalidCode'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !sent) {
      request();
    }
  };

  const handleCodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && sent) {
      verify();
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits, max 6 characters
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
      const input = document.getElementById('phone-input');
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.pageTitle')}
          </h1>
          <p className="text-gray-600">
            {t('auth.pageSubtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          {!sent ? (
            // Step 1: Phone number input
            <div className="space-y-4">
              <div>
                <label htmlFor="phone-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('auth.phoneLabel')}
                </label>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={handlePhoneKeyDown}
                  placeholder={t('auth.phonePlaceholder')}
                  disabled={loading}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t('auth.phoneExample')}
                </p>
              </div>

              <button
                onClick={request}
                disabled={loading || !phone || phone.length < 10}
                className="w-full bg-[#23E5DB] hover:bg-[#1dd4cb] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('auth.sendingButton')}
                  </>
                ) : (
                  t('auth.getCodeButton')
                )}
              </button>
            </div>
          ) : (
            // Step 2: Verification code input
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="code-input" className="block text-sm font-semibold text-gray-700">
                    {t('auth.codeLabel')}
                  </label>
                  <button
                    onClick={resetForm}
                    className="text-xs text-[#23E5DB] hover:text-[#1dd4cb] font-medium"
                  >
                    {t('auth.changeNumberButton')}
                  </button>
                </div>
                <input
                  id="code-input"
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={e => handleCodeChange(e.target.value)}
                  onKeyDown={handleCodeKeyDown}
                  placeholder="000000"
                  disabled={loading}
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:border-[#23E5DB] focus:ring-2 focus:ring-[#23E5DB] focus:ring-opacity-20 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {t('auth.codeSentMessage', { phone })}
                </p>
              </div>

              {/* Debug code in development */}
              {sent.debug_code && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-yellow-800 mb-1">
                    {t('auth.developmentMode')}
                  </p>
                  <p className="text-sm font-mono text-yellow-900">
                    {t('auth.codeLabel2')} <span className="font-bold">{sent.debug_code}</span>
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
                    {t('auth.verifyingButton')}
                  </>
                ) : (
                  t('auth.verifyButton')
                )}
              </button>

              {/* Resend code */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    {t('auth.resendCodeCountdown', { countdown })}
                  </p>
                ) : (
                  <button
                    onClick={request}
                    disabled={loading}
                    className="text-sm text-[#23E5DB] hover:text-[#1dd4cb] font-medium disabled:opacity-50"
                  >
                    {t('auth.resendCodeButton')}
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

export default function OTPPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OTPPageContent />
    </Suspense>
  );
}
