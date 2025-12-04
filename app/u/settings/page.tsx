'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';
import LocationPicker from '@/components/ui/LocationPicker';
import { appConfig } from '@/config';
import { compressImage } from '@/lib/photoCompressor';
import './styles.css';

export default function SettingsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { profile, loading, error, getProfile, updateProfile, deleteAccount } = useProfile();

  // Form state
  const [locationId, setLocationId] = useState<number | null>(null);
  const [locationPath, setLocationPath] = useState<string>('');
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [isCompressing, setIsCompressing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile) {
      setUserName(profile.displayName || '');
      setLocationId(profile.locationId || null);
      setLocationPath(profile.locationName || '');
      setLogoPreview(profile.logoUrl ? `${appConfig.api.baseUrl}${profile.logoUrl}` : null);
    }
  }, [profile]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      setLogoPreview(null); // Clear previous preview
      try {
        const compressedFile = await compressImage(file);
        setLogoFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result as string);
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Failed to compress image:", error);
        // Handle error, maybe show a notification to the user
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

      alert('Profile saved successfully!');
      await getProfile();
      setLogoFile(null); // Reset file input
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (confirm(t('settings.deleteAccountWarning'))) {
      try {
        await deleteAccount();
        router.push('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account');
      }
    }
  };

  if (!mounted || loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }
  
  if (error) {
      return <div>{error}</div>
  }

  return (
    <div className="page-section page-section--padded" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>
        {t('settings.pageTitle')}
      </h1>

      {/* Edit Profile Card */}
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
                <span>{locationPath || 'Select a location'}</span>
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
            {saving ? 'Saving...' : t('settings.saveButton')}
          </button>
        </div>
      </div>

      {/* Delete Account Card */}
      <div className="settings-card delete-section" style={{marginTop: '32px'}}>
        <div className="settings-card-header">
          <h2 className="settings-card-title">{t('settings.deleteAccount')}</h2>
        </div>
        <div className="settings-card-body">
          <p>{t('settings.deleteAccountWarning')}</p>
        </div>
        <div className="settings-card-footer">
          <button onClick={handleDeleteProfile} className="btn-save btn-danger">
            {t('settings.deleteProfileButton')}
          </button>
        </div>
      </div>
    </div>
  );
}