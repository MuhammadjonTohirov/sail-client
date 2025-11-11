import { IModerationRepository } from '../../domain/repositories/IModerationRepository';
import { ReportReason } from '../../domain/models/ReportReason';
import { ReportPayload } from '../../domain/models/ReportPayload';
import { ReportReasonDTO } from '../models/ModerationDTO';
import { ModerationMapper } from '../mappers/ModerationMapper';
import { Moderation } from '../../lib/moderationApi';

export class ModerationRepositoryImpl implements IModerationRepository {
  async getReportReasons(language?: string): Promise<ReportReason[]> {
    const dtos: ReportReasonDTO[] = await Moderation.reasons(language as any);
    return ModerationMapper.reasonsToDomain(dtos);
  }

  async submitReport(payload: ReportPayload): Promise<void> {
    const dto = ModerationMapper.payloadToDTO(payload);
    await Moderation.submitReport(dto);
  }
}
