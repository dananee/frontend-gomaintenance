"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface NotificationFormValues {
  work_order_updates: boolean;
  low_stock_alerts: boolean;
  maintenance_reminders: boolean;
  realtime_alerts: boolean;
}

export function NotificationSettingsForm() {
  const { notifications, isLoading, updateNotifications, isUpdating } = useNotifications();
  const t = useTranslations("settings.notifications");

  const { register, handleSubmit, reset, setValue, watch, formState: { isDirty } } = useForm<NotificationFormValues>();

  useEffect(() => {
    if (notifications) {
      reset({
        work_order_updates: notifications.work_order_updates,
        low_stock_alerts: notifications.low_stock_alerts,
        maintenance_reminders: notifications.maintenance_reminders,
        realtime_alerts: notifications.realtime_alerts,
      });
    }
  }, [notifications, reset]);

  const onSubmit = async (data: NotificationFormValues) => {
    await updateNotifications(data);
    reset(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="work_order_updates" className="text-base">{t("form.workOrderUpdates.title")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("form.workOrderUpdates.description")}
                </p>
              </div>
              <Switch
                id="work_order_updates"
                checked={watch("work_order_updates")}
                onCheckedChange={(checked) => {
                  setValue("work_order_updates", checked, { shouldDirty: true });
                }}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="low_stock_alerts" className="text-base">{t("form.lowStockAlerts.title")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("form.lowStockAlerts.description")}
                </p>
              </div>
              <Switch
                id="low_stock_alerts"
                checked={watch("low_stock_alerts")}
                onCheckedChange={(checked) => {
                  setValue("low_stock_alerts", checked, { shouldDirty: true });
                }}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance_reminders" className="text-base">{t("form.maintenanceReminders.title")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("form.maintenanceReminders.description")}
                </p>
              </div>
              <Switch
                id="maintenance_reminders"
                checked={watch("maintenance_reminders")}
                onCheckedChange={(checked) => {
                  setValue("maintenance_reminders", checked, { shouldDirty: true });
                }}
              />
            </div>

            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="realtime_alerts" className="text-base">{t("form.realtimeAlerts.title")}</Label>
                <p className="text-sm text-muted-foreground">
                  {t("form.realtimeAlerts.description")}
                </p>
              </div>
              <Switch
                id="realtime_alerts"
                checked={watch("realtime_alerts")}
                onCheckedChange={(checked) => {
                  setValue("realtime_alerts", checked, { shouldDirty: true });
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("form.save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
