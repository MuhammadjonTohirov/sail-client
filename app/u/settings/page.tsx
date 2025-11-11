'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';
import LocationPicker from '@/components/ui/LocationPicker';
import { appConfig } from '@/config';

export default function SettingsPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Use Clean Architecture hook
  const { profile, loading, error, getProfile, updateProfile, deleteAccount } = useProfile();

  // Accordion state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [logoAndBannerOpen, setLogoAndBannerOpen] = useState(false);
  const [accountManagementOpen, setAccountManagementOpen] = useState(false);

  // Edit Profile state
  const [locationId, setLocationId] = useState<number | null>(null);
  const [locationPath, setLocationPath] = useState<string>('');
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [userName, setUserName] = useState('');

  // Logo and Banner state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    getProfile();
  }, [getProfile]);

  // Update form state when profile loads
  useEffect(() => {
    if (profile) {
      setUserName(profile.displayName || '');
      setLocationId(profile.locationId || null);
      setLocationPath(profile.locationName || '');
      if (profile.logoUrl) {
        setLogoPreview(appConfig.api.baseUrl + profile.logoUrl);
      }
      if (profile.bannerUrl) {
        setBannerPreview(profile.bannerUrl);
      }
    }
  }, [profile]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        displayName: userName,
        location: locationId,
      });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const name = appConfig.name;

  const handleSaveMedia = async () => {
    setSaving(true);
    try {
      const payload: any = {};
      if (logoFile) payload.logo = logoFile;
      if (bannerFile) payload.banner = bannerFile;

      if (Object.keys(payload).length > 0) {
        await updateProfile(payload);
        alert('Media saved successfully!');
        // Reload to show uploaded images
        await getProfile();
      }
    } catch (error) {
      console.error('Failed to save media:', error);
      alert('Failed to save media');
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

  if (!mounted) {
    return null;
  }

  return (
    <div className="page-section page-section--padded" style={{ maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '32px' }}>
        {t('settings.pageTitle')}
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Edit Profile Section */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setEditProfileOpen(!editProfileOpen)}
            style={{
              width: '100%',
              padding: '24px',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 600,
              color: 'black'
            }}
          >
            {t('settings.editProfile')}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              color='black'
              style={{
                transform: editProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {editProfileOpen && (
            <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Location Field */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    {t('settings.location')}
                  </label>
                  <div
                    onClick={() => setLocationPickerOpen(true)}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'white',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span style={{ flex: 1 }}>
                      {locationPath || 'Ташкент, Мирзо-Улугбекский район'}
                    </span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <LocationPicker
                    open={locationPickerOpen}
                    onClose={() => setLocationPickerOpen(false)}
                    onSelect={(loc) => {
                      setLocationId(loc.id);
                      setLocationPath(loc.path);
                    }}
                    locale={locale as 'ru' | 'uz'}
                  />
                </div>

                {/* Name Field */}
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    { t('settings.nameOnOLX', { name })}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '15px',
                    }}
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveProfile}
                  className="btn-accent"
                  style={{ width: 'fit-content' }}
                  disabled={saving || loading}
                >
                  {saving ? 'Saving...' : t('settings.saveButton')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logo and Banner Section */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setLogoAndBannerOpen(!logoAndBannerOpen)}
            style={{
              width: '100%',
              padding: '24px',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'black',
              fontWeight: 600,
            }}
          >
            {t('settings.logoAndBanner')}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{
                transform: logoAndBannerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {logoAndBannerOpen && (
            <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
              <div style={{ marginTop: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '32px' }}>
                  {/* Logo Upload */}
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                      {t('settings.logo')}
                    </h3>
                    <label
                      style={{
                        width: '200px',
                        height: '200px',
                        border: '2px dashed var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: '#f7f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: 'none' }}
                      />
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      )}
                    </label>
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '14px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{t('settings.recommendedSize')}</div>
                      <div>{t('settings.logoSize')}</div>
                    </div>
                  </div>

                  {/* Logo Info */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ background: '#f0f9ff', padding: '32px', borderRadius: '12px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <circle cx="12" cy="17" r="0.5" fill="#0ea5e9" />
                        </svg>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
                            {t('settings.logoDisplayInfo')}
                          </h3>
                          <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: 1.8 }}>
                            <li>{t('settings.logoDisplayBusiness', {name})}</li>
                            <li>{t('settings.logoDisplayListings')}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                    {t('settings.banner')}
                  </h3>
                  <label
                    style={{
                      width: '100%',
                      height: '200px',
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: '#f7f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      style={{ display: 'none' }}
                    />
                    {bannerPreview ? (
                      <img src={bannerPreview} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </label>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveMedia}
                  className="btn-accent"
                  style={{ width: 'fit-content' }}
                  disabled={saving || loading}
                >
                  {saving ? 'Uploading...' : t('settings.saveButton')}
                </button>
              </div>
            </div>
          )}
        </div>

                {/* Account Management Section */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <button
            onClick={() => setAccountManagementOpen(!accountManagementOpen)}
            style={{
              width: '100%',
              padding: '24px',
              background: 'transparent',
              border: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 600,
              color: 'black'
            }}
          >
            {t('settings.accountManagement')}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              color='black'
              fill="none"
              style={{
                transform: accountManagementOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {accountManagementOpen && (
            <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)' }}>
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
                  {t('settings.deleteAccount')}
                </h3>
                <p style={{ color: 'var(--muted)', marginBottom: '24px', lineHeight: 1.6 }}>
                  {t('settings.deleteAccountWarning')}
                </p>
                <button
                  onClick={handleDeleteProfile}
                  className="btn-accent"
                  style={{ background: '#dc2626' }}
                >
                  {t('settings.deleteProfileButton')}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
