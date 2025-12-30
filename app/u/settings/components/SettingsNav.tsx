'use client';

import { useI18n } from '@/lib/i18n';
import { Lineicons } from "@lineiconshq/react-lineicons";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  User4Outlined as UserIcon,
  Bell1Outlined as BellIcon,
  TelegramOutlined as TelegramIcon,
  Locked1Outlined as LockIcon,
  Gear1Outlined as CogIcon,
} from "@lineiconshq/free-icons";

export type SettingsTab = 'profile' | 'notifications' | 'telegram' | 'security' | 'account';

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  const { t } = useI18n();

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: t('settings.menu.profile', 'Profile'), icon: UserIcon },
    { id: 'notifications', label: t('settings.menu.notifications', 'Notifications'), icon: BellIcon },
    { id: 'telegram', label: t('settings.menu.telegram', 'Telegram'), icon: TelegramIcon },
    { id: 'security', label: t('settings.menu.security', 'Security'), icon: LockIcon },
    { id: 'account', label: t('settings.menu.account', 'Account'), icon: CogIcon },
  ];

  return (
    <div className="settings-nav-container">
      <nav className="settings-nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "settings-nav-item relative",
                isActive ? "text-accent" : "text-gray-500 hover:text-gray-900"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-accent-soft rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Lineicons icon={tab.icon} width={20} height={20} />
                <span>{tab.label}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
