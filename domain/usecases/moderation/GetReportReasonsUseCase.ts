import { IModerationRepository } from '../../repositories/IModerationRepository';
import { ReportReason } from '../../models/ReportReason';

export class GetReportReasonsUseCase {
  constructor(private readonly repository: IModerationRepository) {}

  async execute(language?: string): Promise<ReportReason[]> {
    return await this.repository.getReportReasons(language);
  }
}
