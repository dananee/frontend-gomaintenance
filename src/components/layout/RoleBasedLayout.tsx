"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TechnicianLayout } from "@/layouts/TechnicianLayout";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

export function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
  const { user } = useAuthStore();

  // Middleware ensures user is authenticated and authorized
  // This component only needs to select the appropriate layout
  
  if (!user) {
    // This should rarely happen since middleware redirects unauthenticated users
    // But we handle it gracefully just in case
    return null;
  }

  // Select layout based on role
  if (user.role === "technician") {
    return <TechnicianLayout>{children}</TechnicianLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
