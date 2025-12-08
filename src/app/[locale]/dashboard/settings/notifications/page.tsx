"use client";

import { NotificationSettingsForm } from "@/features/settings/components/NotificationSettingsForm";

interface NotificationSettingsPageProps {
  params: {
    locale: string;
  };
}

export default function NotificationSettingsPage({ params }: NotificationSettingsPageProps) {
  const { locale } = params;
  return <NotificationSettingsForm />;
}