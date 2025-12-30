'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';
import LocationPicker from '@/components/ui/LocationPicker';
import { appConfig, trustedImageUrl } from '@/config';
import { compressImage } from '@/lib/photoCompressor';

export default function ProfileSettings() {
  const { t } = useI18n();
  const { profile, getProfile, updateProfile } = useProfile();

  const [userName, setUserName] = useState('');
  const [locationId, setLocationId] = useState<number | null>(null);
  const [locationPath, setLocationPath] = useState<string>('');
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setUserName(profile.displayName || '');
      setLocationId(profile.locationId || null);
      setLocationPath(profile.locationName || '');
      const avatar = profile.logoUrl ?? profile.telegramPhotoUrl ?? null;
      const trustedAvatar = avatar ? trustedImageUrl(avatar) : null;
      setLogoPreview(trustedAvatar);
    }
  }, [profile]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      setLogoPreview(null);
      try {
        const compressedFile = await compressImage(file);
        setLogoFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Failed to compress image:", error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const profileData: any = {
        displayName: userName,
        location: locationId,
      };
      if (logoFile) {
        profileData.logo = logoFile;
      }

      await updateProfile(profileData);

      alert(t('settings.saveSuccess'));
      await getProfile();
      setLogoFile(null);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(t('settings.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2 className="settings-card-title">{t('settings.editProfile')}</h2>
      </div>
      <div className="settings-card-body edit-profile-body">
        {/* Left side for Logo */}
        <div className="edit-profile-logo-section">
          <label className="upload-area">
            <input type="file" accept="image/*" onChange={handleLogoChange} disabled={isCompressing} />
            {isCompressing ? (
              <div className="spinner"></div>
            ) : logoPreview ? (
              <img src={logoPreview} alt="Logo Preview" />
            ) : (
              <div className="upload-area-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 5v14M5 12h14" /></svg>
              </div>
            )}
          </label>
          <div className="info-box-minimal">
            {t('settings.logoSize')}
          </div>
        </div>

        {/* Right side for Fields */}
        <div className="edit-profile-fields-section">
          <div className="form-group">
            <label className="form-label">{t('settings.nameOnOLX', { name: appConfig.name })}</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('settings.location')}</label>
            <div
              onClick={() => setLocationPickerOpen(true)}
              className="location-display"
            >
              <span>{locationPath || t('settings.selectLocation')}</span>
            </div>
            <LocationPicker
              open={locationPickerOpen}
              onClose={() => setLocationPickerOpen(false)}
              onSelect={(loc) => {
                setLocationId(loc.id);
                setLocationPath(loc.path);
                setLocationPickerOpen(false);
              }}
            />
          </div>
        </div>
      </div>
      <div className="settings-card-footer">
        <button onClick={handleSaveChanges} className="btn-accent btn-save" disabled={saving || isCompressing}>
          {saving ? t('settings.saving') : t('settings.saveButton')}
        </button>
      </div>
    </div>
  );
}
