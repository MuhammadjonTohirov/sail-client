import { ReportReasonDTO, ReportPayloadDTO } from '../models/ModerationDTO';
import { ReportReason } from '../../domain/models/ReportReason';
import { ReportPayload } from '../../domain/models/ReportPayload';

export class ModerationMapper {
  static reasonToDomain(dto: ReportReasonDTO): ReportReason {
    return {
      code: dto.code,
      title: dto.title,
      description: dto.description,
      children: dto.children ? dto.children.map(child => this.reasonToDomain(child)) : undefined,
    };
  }

  static reasonsToDomain(dtos: ReportReasonDTO[] | any): ReportReason[] {
    // Handle API response that might have { items: [...] } structure
    const items = Array.isArray(dtos) ? dtos : (dtos?.items || []);
    return items.map((dto: ReportReasonDTO) => this.reasonToDomain(dto));
  }

  static payloadToDTO(payload: ReportPayload): ReportPayloadDTO {
    return {
      listing: payload.listingId,
      reason_code: payload.reasonCode,
      notes: payload.notes,
    };
  }
}
