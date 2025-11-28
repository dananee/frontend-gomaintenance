"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
    return () => {
      // Optional: Start on unmount (navigation start), but this might be flaky
      // NProgress.start(); 
    };
  }, [pathname, searchParams]);

  // To truly capture start of navigation in App Router is complex without
  // wrapping Link or using experimental hooks. 
  // For now, we'll rely on the fact that this component re-renders on path change.
  // A better approach might be to expose NProgress start/stop via a hook 
  // and use it in data fetching or mutation hooks.
  
  return null;
}
