import { IModerationRepository } from '../../domain/repositories/IModerationRepository';
import { ReportReason } from '../../domain/models/ReportReason';
import { ReportPayload } from '../../domain/models/ReportPayload';
import { ModerationMapper } from '../mappers/ModerationMapper';
import { Moderation } from '../../lib/moderationApi';
import type { SupportedLocale } from '@/lib/apiUtils';

export class ModerationRepositoryImpl implements IModerationRepository {
  async getReportReasons(language?: string): Promise<ReportReason[]> {
    const dtos = await Moderation.reasons(language as SupportedLocale);
    return ModerationMapper.reasonsToDomain(dtos);
  }

  async submitReport(payload: ReportPayload): Promise<void> {
    const dto = ModerationMapper.payloadToDTO(payload);
    await Moderation.submitReport(dto);
  }
}
