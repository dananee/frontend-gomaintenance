"use client";

import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account and workspace preferences</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <SettingsSidebar />
        <div className="flex-1 w-full max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
}
