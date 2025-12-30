'use client';

import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';

export default function AccountSettings() {
  const { t } = useI18n();
  const router = useRouter();
  const { deleteAccount } = useProfile();

  const handleDeleteProfile = async () => {
    if (confirm(t('settings.deleteAccountWarning'))) {
      try {
        await deleteAccount();
        router.push('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
        alert(t('settings.deleteError'));
      }
    }
  };

  return (
    <div className="settings-card delete-section">
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
  );
}
