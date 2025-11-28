"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TechnicianLayout } from "@/layouts/TechnicianLayout";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { isRouteAllowed } from "@/lib/rbac/routeAccess";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

export function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    const allowed = isRouteAllowed(pathname, user.role);

    if (!allowed) {
      router.push("/not-authorized");
    }
  }, [user, isAuthenticated, router, pathname, isClient]);

  const isAllowed = isRouteAllowed(pathname, user?.role);

  if (!isClient || !isAuthenticated || !user || !isAllowed) {
    return <div className="flex h-screen items-center justify-center"><ProgressBar /></div>;
  }

  // Cast role to string for comparison if needed, or rely on TypeScript if Role is compatible
  if (user?.role === "mechanic") {
    return <TechnicianLayout>{children}</TechnicianLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
