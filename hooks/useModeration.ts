import { useState, useCallback } from 'react';
import { ModerationRepositoryImpl } from '../data/repositories/ModerationRepositoryImpl';
import { GetReportReasonsUseCase } from '../domain/usecases/moderation/GetReportReasonsUseCase';
import { SubmitReportUseCase } from '../domain/usecases/moderation/SubmitReportUseCase';
import type { ReportReason } from '../domain/models/ReportReason';
import type { ReportPayload } from '../domain/models/ReportPayload';

const repository = new ModerationRepositoryImpl();
const getReportReasonsUseCase = new GetReportReasonsUseCase(repository);
const submitReportUseCase = new SubmitReportUseCase(repository);

export function useModeration() {
  const [reasons, setReasons] = useState<ReportReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadReasons = useCallback(async (language?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReportReasonsUseCase.execute(language);
      setReasons(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load report reasons';
      setError(errorMessage);
      setReasons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReport = useCallback(async (payload: ReportPayload) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      await submitReportUseCase.execute(payload);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit report';
      setSubmitError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    reasons,
    loading,
    error,
    submitting,
    submitError,
    loadReasons,
    submitReport,
  };
}
