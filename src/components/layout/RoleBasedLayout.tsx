"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TechnicianLayout } from "@/layouts/TechnicianLayout";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

export function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated || !user) {
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, isAuthenticated, router, pathname, isHydrated]);

  if (!isHydrated || !isAuthorized) {
    return <div className="flex h-screen items-center justify-center"><ProgressBar /></div>;
  }

  // Cast role to string for comparison if needed, or rely on TypeScript if Role is compatible
  if (user?.role === "mechanic" || user?.role === "driver") {
    return <TechnicianLayout>{children}</TechnicianLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
