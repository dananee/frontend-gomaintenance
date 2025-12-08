"use client";

import { BrandingSettingsForm } from "@/features/settings/components/BrandingSettingsForm";

interface BrandingSettingsPageProps {
  params: {
    locale: string;
  };
}

export default function BrandingSettingsPage({ params }: BrandingSettingsPageProps) {
  const { locale } = params;
  return <BrandingSettingsForm />;
}