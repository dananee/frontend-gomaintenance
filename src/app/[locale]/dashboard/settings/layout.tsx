"use client";

import { use } from "react";
import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const { locale } = use(params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account and workspace preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <SettingsSidebar locale={locale} />
        <div className="flex-1 w-full max-w-3xl">{children}</div>
      </div>
    </div>
  );
}
