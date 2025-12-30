'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useProfile } from '@/hooks';
import { Auth } from '@/lib/authApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import SettingsNav, { SettingsTab } from './components/SettingsNav';
import ProfileSettings from './components/ProfileSettings';
import TelegramSettings, { SecurityInfo } from './components/TelegramSettings';
import SecuritySettings from './components/SecuritySettings';
import AccountSettings from './components/AccountSettings';
import NotificationSettings from './components/NotificationSettings';
import './styles.css';

export default function SettingsPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const { loading: profileLoading, getProfile } = useProfile();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo | null>(null);
  const [securityLoading, setSecurityLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    getProfile();
    loadSecurityInfo();
  }, [getProfile]);

  const loadSecurityInfo = async () => {
    try {
      const info = await Auth.getSecurityInfo();
      setSecurityInfo(info);
    } catch (err) {
      console.error('Failed to load security info:', err);
    } finally {
      setSecurityLoading(false);
    }
  };

  if (!mounted || profileLoading) {
    return <LoadingSpinner fullScreen size="large" />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'telegram':
        return (
          <TelegramSettings 
            securityInfo={securityInfo} 
            loading={securityLoading} 
            onReloadSecurity={loadSecurityInfo} 
          />
        );
      case 'security':
        return (
          <SecuritySettings 
            securityInfo={securityInfo} 
            loading={securityLoading} 
            onReloadSecurity={loadSecurityInfo} 
          />
        );
      case 'account':
        return <AccountSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="settings-page-container">
      <h1 className="settings-page-title">{t('settings.pageTitle')}</h1>
      
      <div className="settings-layout">
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="settings-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}