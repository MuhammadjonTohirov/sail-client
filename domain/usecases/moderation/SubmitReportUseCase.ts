import { IModerationRepository } from '../../repositories/IModerationRepository';
import { ReportPayload } from '../../models/ReportPayload';

export class SubmitReportUseCase {
  constructor(private readonly repository: IModerationRepository) {}

  async execute(payload: ReportPayload): Promise<void> {
    if (!payload.listingId || payload.listingId <= 0) {
      throw new Error('Valid listing ID is required');
    }
    if (!payload.reasonCode || payload.reasonCode.trim().length === 0) {
      throw new Error('Reason code is required');
    }

    await this.repository.submitReport(payload);
  }
}
