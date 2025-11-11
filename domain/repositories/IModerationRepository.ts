import { ReportReason } from '../models/ReportReason';
import { ReportPayload } from '../models/ReportPayload';

export interface IModerationRepository {
  getReportReasons(language?: string): Promise<ReportReason[]>;
  submitReport(payload: ReportPayload): Promise<void>;
}
