"use client";

import { CompanySettingsForm } from "@/features/settings/components/CompanySettingsForm";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface CompanySettingsPageProps {
  params: {
    locale: string;
  };
}

export default function CompanySettingsPage({ params }: CompanySettingsPageProps) {
  const { locale } = params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanySettingsForm />
    </Suspense>
  );
}