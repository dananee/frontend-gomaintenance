"use client";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumMetricCard } from "@/components/ui/premium-metric-card";
import { UserActivityLog } from "@/features/users/components/UserActivityLog";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/features/activityLogs/api/activityLogs";
import { getUserStats } from "@/features/users/api/getUserStats";
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Activity,
  UserCircle 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort } from "@/lib/formatters";

export default function ProfilePage() {
  const { user } = useAuth();
  const t = useTranslations("profilePage");
  const ts = useTranslations("settings.profile");

  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["activity-logs", "me", user?.id],
    queryFn: () => getActivityLogs({ user_id: user?.id, page_size: 20 }),
    enabled: !!user?.id,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["user-stats", "me", user?.id],
    queryFn: getUserStats,
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  // Get initials for avatar fallback
  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column - User Info Card */}
        <div className="md:col-span-4 space-y-6">
          <Card className="overflow-hidden border-none shadow-premium bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col items-center -mt-16">
                <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-950 shadow-xl">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name || user.email} />}
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">{t("info.email")}</p>
                    <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">{t("info.role")}</p>
                    <p className="text-gray-900 dark:text-gray-100 capitalize">{user.role}</p>
                  </div>
                </div>

                {user.tenant_id && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase">{t("info.tenant")}</p>
                      <p className="text-gray-900 dark:text-gray-100">{user.tenant_name || "N/A"}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">{t("info.joined")}</p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {user.created_at ? formatDateShort(user.created_at) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs & Stats */}
        <div className="md:col-span-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <PremiumMetricCard
              title={t("stats.completedWorkOrders")}
              value={isLoadingStats ? "..." : stats?.completed_work_orders || 0}
              icon={CheckCircle2}
              variant="green"
            />
            <PremiumMetricCard
              title={t("stats.activeTasks")}
              value={isLoadingStats ? "..." : stats?.active_work_orders || 0}
              icon={Clock}
              variant="orange"
            />
            <PremiumMetricCard
              title={t("stats.participationRate")}
              value={isLoadingStats ? "..." : `${Math.round(stats?.participation_rate || 0)}%`}
              icon={Activity}
              variant="purple"
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
              <TabsTrigger value="activity">{t("tabs.activity")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("info.title")}</CardTitle>
                  <CardDescription>
                    {ts("description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{ts("form.firstName")}</p>
                      <p className="text-lg font-medium">{user.first_name || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{ts("form.lastName")}</p>
                      <p className="text-lg font-medium">{user.last_name || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{ts("form.email")}</p>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{ts("form.role")}</p>
                      <p className="text-lg font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity Mini-View */}
              {!isLoadingLogs && activityLogs && (
                <UserActivityLog activities={activityLogs.data.slice(0, 5).map(log => ({
                  id: log.id,
                  type: (log.entity_type as any) || "system",
                  action: log.action,
                  details: log.details?.description || "",
                  timestamp: log.created_at
                }))} />
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              {!isLoadingLogs && activityLogs && (
                <UserActivityLog activities={activityLogs.data.map(log => ({
                  id: log.id,
                  type: (log.entity_type as any) || "system",
                  action: log.action,
                  details: log.details?.description || "",
                  timestamp: log.created_at
                }))} />
              )}
              {isLoadingLogs && (
                <Card className="h-96 w-full animate-pulse bg-gray-100 dark:bg-gray-800" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
