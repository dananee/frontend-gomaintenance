import { RoleBasedLayout } from "@/components/layout/RoleBasedLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleBasedLayout>{children}</RoleBasedLayout>;
}
