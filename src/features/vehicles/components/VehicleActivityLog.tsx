"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { formatDateShort } from "@/lib/formatters";
import { useTranslations } from "next-intl";

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface VehicleActivityLogProps {
  activities?: ActivityLog[];
}

export function VehicleActivityLog({ activities = [], }: VehicleActivityLogProps) {
  const t = useTranslations("features.vehicles.activity");
  
  // Note: We might want to translate these mock activities too, 
  // but for now we focus on the static UI elements.
  const mockActivities: ActivityLog[] = activities.length > 0 ? activities : [
    {
      id: "1",
      action: "Status Changed",
      description: "Vehicle status updated to 'Active'",
      timestamp: "2024-11-25T10:30:00Z",
      user: "Admin User",
    },
    {
      id: "2",
      action: "Maintenance Completed",
      description: "Oil change and filter replacement completed",
      timestamp: "2024-11-15T14:20:00Z",
      user: "John Smith",
    },
    {
      id: "3",
      action: "Work Order Created",
      description: "New work order created for brake inspection",
      timestamp: "2024-11-10T09:15:00Z",
      user: "Dispatcher",
    },
    {
      id: "4",
      action: "Vehicle Updated",
      description: "Mileage updated to 45,000 km",
      timestamp: "2024-11-05T16:45:00Z",
      user: "Driver Tom",
    },
  ];

  if (mockActivities.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {t("noLogs")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t("historyTitle")}
      </p>

      <div className="space-y-3">
        {mockActivities.map((activity) => (
          <Card key={activity.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {activity.action}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDateShort(activity.timestamp)}</span>
                    {activity.user && (
                      <>
                        <span>•</span>
                        <span>{activity.user}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
