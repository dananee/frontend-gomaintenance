"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Wrench, User, LogIn, Settings } from "lucide-react";

interface ActivityLog {
  id: string;
  type: "login" | "work_order" | "maintenance" | "profile" | "system";
  action: string;
  details?: string;
  timestamp: string;
  referenceId?: string;
}

interface UserActivityLogProps {
  activities?: ActivityLog[];
}

const activityConfig = {
  login: {
    icon: LogIn,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  work_order: {
    icon: Wrench,
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  maintenance: {
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  profile: {
    icon: User,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  system: {
    icon: Settings,
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-gray-800",
  },
};

export function UserActivityLog({ activities = [] }: UserActivityLogProps) {
  // Mock data if none provided
  const displayActivities: ActivityLog[] = activities.length > 0 ? activities : [
    {
      id: "1",
      type: "work_order",
      action: "Completed Work Order #WO-124",
      details: "Replaced brake pads on Ford F-150",
      timestamp: "2024-11-28T14:30:00Z",
      referenceId: "WO-124",
    },
    {
      id: "2",
      type: "login",
      action: "Logged in",
      timestamp: "2024-11-28T09:00:00Z",
    },
    {
      id: "3",
      type: "maintenance",
      action: "Updated maintenance schedule",
      details: "Changed oil change interval for Fleet A",
      timestamp: "2024-11-27T16:45:00Z",
    },
    {
      id: "4",
      type: "work_order",
      action: "Started Work Order #WO-128",
      details: "Tire rotation on Toyota Camry",
      timestamp: "2024-11-27T11:20:00Z",
      referenceId: "WO-128",
    },
    {
      id: "5",
      type: "profile",
      action: "Updated profile information",
      timestamp: "2024-11-26T10:15:00Z",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 pl-4 before:absolute before:left-[27px] before:top-2 before:h-[calc(100%-20px)] before:w-px before:bg-gray-200 dark:before:bg-gray-800">
          {displayActivities.map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.system;
            const Icon = config.icon;

            return (
              <div key={activity.id} className="relative flex gap-4">
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white ${config.bg} dark:border-gray-950`}
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div className="flex flex-col pt-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {activity.action}
                  </p>
                  {activity.details && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.details}
                    </p>
                  )}
                  <span className="mt-1 text-xs text-gray-400">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
