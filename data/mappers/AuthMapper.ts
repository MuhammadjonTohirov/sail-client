import {
  AuthResponseDTO,
  ProfileSnapshotDTO,
  SecurityInfoDTO,
  TelegramAuthDataDTO,
  TelegramChatDTO,
  TokenRefreshResponseDTO,
  VerifyChatsResponseDTO,
} from '../models/AuthDTO';
import {
  AuthResult,
  ProfileSnapshot,
  SecurityInfo,
  TelegramAuthData,
  TokenRefreshResult,
} from '../../domain/models/AuthToken';
import { TelegramChat } from '../../domain/models/TelegramChat';
import { VerifyChatsResult } from '../../domain/repositories/ITelegramRepository';

export class AuthMapper {
  static refreshResponseToDomain(dto: TokenRefreshResponseDTO): TokenRefreshResult {
    return {
      accessToken: dto.access,
      success: true,
    };
  }

  static authResponseToDomain(dto: AuthResponseDTO): AuthResult {
    return {
      accessToken: dto.access,
      refreshToken: dto.refresh,
      profile: this.profileSnapshotToDomain(dto.profile),
    };
  }

  static profileSnapshotToDomain(dto: ProfileSnapshotDTO): ProfileSnapshot {
    return {
      userId: dto.user_id,
      displayName: dto.display_name,
      avatarUrl: dto.avatar_url,
      phoneE164: dto.phone_e164,
      email: dto.email,
      telegramId: dto.telegram_id,
      telegramUsername: dto.telegram_username,
    };
  }

  static securityInfoToDomain(dto: SecurityInfoDTO): SecurityInfo {
    return {
      hasPassword: dto.has_password,
      hasTelegram: dto.has_telegram,
      telegramId: dto.telegram_id,
      telegramUsername: dto.telegram_username,
      email: dto.email,
      phoneE164: dto.phone_e164,
    };
  }

  static telegramAuthDataToDTO(data: TelegramAuthData): TelegramAuthDataDTO {
    return {
      id: data.id,
      first_name: data.firstName,
      last_name: data.lastName,
      username: data.username,
      photo_url: data.photoUrl,
      auth_date: data.authDate,
      hash: data.hash,
    };
  }

  static telegramChatToDomain(dto: TelegramChatDTO): TelegramChat {
    return {
      id: dto.id,
      chatId: dto.chat_id,
      chatTitle: dto.chat_title,
      chatUsername: dto.chat_username,
      chatPhoto: dto.chat_photo,
      chatType: dto.chat_type,
      isActive: dto.is_active,
    };
  }

  static telegramChatsToDomain(dtos: TelegramChatDTO[]): TelegramChat[] {
    return dtos.map(dto => this.telegramChatToDomain(dto));
  }

  static verifyChatsResponseToDomain(dto: VerifyChatsResponseDTO): VerifyChatsResult {
    return {
      verified: dto.verified,
      deactivated: dto.deactivated,
      errors: dto.errors,
    };
  }
}
