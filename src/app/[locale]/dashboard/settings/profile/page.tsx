"use client";

import { ProfileSettingsForm } from "@/features/settings/components/ProfileSettingsForm";

interface ProfileSettingsPageProps {
  params: {
    locale: string;
  };
}

export default function ProfileSettingsPage({ params }: ProfileSettingsPageProps) {
  const { locale } = params;
  return <ProfileSettingsForm />;
}