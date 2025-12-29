"use client";

import { CompanySettingsForm } from "@/features/settings/components/CompanySettingsForm";

import { Suspense } from "react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const dynamic = "force-dynamic";

export default function CompanySettingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><LoadingSpinner /></div>}>
      <CompanySettingsForm />
    </Suspense>
  );
}
