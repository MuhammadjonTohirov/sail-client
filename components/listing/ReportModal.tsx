"use client";
import { useEffect, useMemo, useState } from "react";
import { useModeration } from "@/hooks";
import type { ReportReason } from "@/domain/models/ReportReason";

type ReportNode = ReportReason;

type ReportModalProps = {
  listingId: number;
  open: boolean;
  locale: "ru" | "uz";
  onClose: () => void;
  onSubmitted?: (message: string) => void;
};

const localeLabel = (locale: "ru" | "uz") => (ru: string, uz: string) =>
  locale === "uz" ? uz : ru;

export function ReportModal({
  listingId,
  open,
  locale,
  onClose,
  onSubmitted,
}: ReportModalProps) {
  const label = localeLabel(locale);
  const { reasons, loading, error, submitting, submitError: submitErr, loadReasons, submitReport } = useModeration();
  const [path, setPath] = useState<ReportNode[]>([]);
  const [selectedLeaf, setSelectedLeaf] = useState<ReportNode | null>(null);
  const [notes, setNotes] = useState("");
  const [localSubmitError, setLocalSubmitError] = useState("");

  useEffect(() => {
    if (open && reasons.length === 0 && !loading && !error) {
      loadReasons(locale);
    }
  }, [open, reasons.length, loading, error, locale, loadReasons]);

  useEffect(() => {
    if (!open) {
      setPath([]);
      setSelectedLeaf(null);
      setNotes("");
      setLocalSubmitError("");
    }
  }, [open]);

  const currentOptions: ReportNode[] = useMemo(() => {
    if (selectedLeaf) return [];
    if (path.length === 0) return reasons;
    const last = path[path.length - 1];
    return last.children || [];
  }, [reasons, path, selectedLeaf]);

  const title = useMemo(() => {
    if (selectedLeaf) return selectedLeaf.title;
    if (path.length === 0) return label("Жалоба", "Shikoyat");
    return path[path.length - 1].title;
  }, [selectedLeaf, path, label]);

  const canGoBack = selectedLeaf !== null || path.length > 0;

  const goBack = () => {
    if (selectedLeaf) {
      setSelectedLeaf(null);
      setLocalSubmitError("");
      return;
    }
    if (path.length > 0) {
      setPath((prev) => prev.slice(0, -1));
    } else {
      onClose();
    }
  };

  const handleSelect = (node: ReportNode) => {
    if (node.children && node.children.length > 0) {
      setPath((prev) => [...prev, node]);
      setSelectedLeaf(null);
      setLocalSubmitError("");
      setNotes("");
    } else {
      setSelectedLeaf(node);
      setLocalSubmitError("");
      setNotes("");
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedLeaf) return;
    setLocalSubmitError("");
    try {
      await submitReport({
        listingId,
        reasonCode: selectedLeaf.code,
        notes: notes.trim(),
      });
      onSubmitted?.(label("Жалоба отправлена", "Shikoyat yuborildi"));
      onClose();
      setTimeout(() => {
        setPath([]);
        setSelectedLeaf(null);
        setNotes("");
      }, 0);
    } catch (err: any) {
      setLocalSubmitError(err?.message || label("Не удалось отправить", "Yuborib bo'lmadi"));
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop report-modal">
      <div className="modal report-modal__dialog">
        <div className="modal-header report-modal__header">
          <div className="report-modal__header-side">
            {canGoBack ? (
              <button type="button" className="report-modal__icon-btn" onClick={goBack} aria-label={label("Назад", "Orqaga")}>
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
          </div>
          <div className="modal-title report-modal__title">{title}</div>
          <div className="report-modal__header-side" style={{ justifyContent: "flex-end" }}>
            <button type="button" className="modal-close" onClick={onClose} aria-label={label("Закрыть", "Yopish")}>
              ×
            </button>
          </div>
        </div>

        <div className="modal-body report-modal__body">
          {loading && (
            <div className="report-modal__placeholder">{label("Загрузка…", "Yuklanmoqda…")}</div>
          )}

          {error && (
            <div className="report-modal__placeholder">
              <p className="text-red-600 mb-3">{error}</p>
              <button className="report-modal__retry" onClick={() => loadReasons(locale)}>
                {label("Попробовать снова", "Qayta urinib ko'ring")}
              </button>
            </div>
          )}

          {!loading && !error && !selectedLeaf && (
            <div className="report-options">
              {currentOptions.map((item) => (
                <button key={item.code} className="report-option" onClick={() => handleSelect(item)}>
                  <div className="report-option__text">
                    <div className="report-option__title">{item.title}</div>
                    {item.description && <div className="report-option__desc">{item.description}</div>}
                  </div>
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && selectedLeaf && (
            <div className="report-form">
              <div className="report-form__summary">
                <div className="report-form__title">{selectedLeaf.title}</div>
                {selectedLeaf.description && <p className="report-form__desc">{selectedLeaf.description}</p>}
              </div>
              <label className="report-form__label">
                {label("Объясните проблему", "Muammoni tushuntiring")}
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 1000))}
                  rows={4}
                  placeholder={label(
                    "Совет: хотите пожаловаться на несколько объявлений? Вставьте ссылки сюда.",
                    "Maslahat: bir nechta eʼlondan shikoyat qilmoqchimisiz? Havolalarni shu yerga joylashtiring."
                  )}
                />
                <div className="report-form__counter">{notes.length}/1000</div>
              </label>
              {(localSubmitError || submitErr) && <div className="report-form__error">{localSubmitError || submitErr}</div>}
            </div>
          )}
        </div>

        {!loading && !error && (
          <div className="modal-footer report-modal__footer">
            <button type="button" onClick={onClose} className="report-modal__secondary">
              {label("Отмена", "Bekor qilish")}
            </button>
            <button
              type="button"
              className="report-modal__primary"
              onClick={handleSubmitReport}
              disabled={!selectedLeaf || submitting}
            >
              {submitting ? label("Отправка…", "Yuborilmoqda…") : label("Отправить жалобу", "Shikoyat yuborish")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
