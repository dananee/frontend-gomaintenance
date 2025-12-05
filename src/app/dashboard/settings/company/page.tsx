"use client";

import { CompanySettingsForm } from "@/features/settings/components/CompanySettingsForm";

import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function CompanySettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompanySettingsForm />
    </Suspense>
  );
}
