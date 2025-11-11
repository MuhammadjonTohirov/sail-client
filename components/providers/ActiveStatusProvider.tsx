"use client";
import { useEffect } from 'react';
import { ProfileRepositoryImpl } from '@/data/repositories/ProfileRepositoryImpl';
import { UpdateLastActiveUseCase } from '@/domain/usecases/profile/UpdateLastActiveUseCase';

const REPORT_INTERVAL_MS = 60_000;

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('access_token'));
}

export default function ActiveStatusProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const repository = new ProfileRepositoryImpl();
    const useCase = new UpdateLastActiveUseCase(repository);

    let isMounted = true;

    const reportActive = async () => {
      if (!isMounted || !hasToken()) {
        return;
      }
      try {
        await useCase.execute();
      } catch {
        // best-effort; ignore failures
      }
    };

    reportActive();

    const onFocus = () => {
      void reportActive();
    };

    const onVisibility = () => {
      if (!document.hidden) {
        void reportActive();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    const intervalId = window.setInterval(() => {
      void reportActive();
    }, REPORT_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(intervalId);
    };
  }, []);

  return <>{children}</>;
}
