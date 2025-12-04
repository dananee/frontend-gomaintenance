"use client";

import dynamic from "next/dynamic";

const OfflineIndicator = dynamic(
  () => import("./OfflineIndicator").then((m) => m.OfflineIndicator),
  { ssr: false }
);

export function OfflineIndicatorClient() {
  return <OfflineIndicator />;
}