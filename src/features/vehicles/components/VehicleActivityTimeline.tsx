"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { formatDateTime } from "@/lib/formatters";
import { useTranslations } from "next-intl";

interface VehicleActivityEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type?: string;
}

interface VehicleActivityTimelineProps {
  events?: VehicleActivityEvent[];
}

export function VehicleActivityTimeline({ events = [] }: VehicleActivityTimelineProps) {
  const t = useTranslations("features.vehicles.activity"); // Using activity namespace as it fits best, though keys are generic
  // Alternatively could use features.vehicles.maintenance.timelineTitle if appropriate, but let's stick to what we have or generic keys.
  // Actually, I should use "features.vehicles.activity" for title.

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">{t("title")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {sortedEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {t("noActivity")}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border p-4 transition hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {event.title}
                    </p>
                    {event.type && <Badge variant="outline">{event.type}</Badge>}
                  </div>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(event.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
