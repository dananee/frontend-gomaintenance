"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  MessageSquare,
  FileText,
  Wrench,
  User,
  Clock
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type: "status_change" | "comment" | "attachment" | "task_update" | "assignment";
  title: string;
  description: string;
  user: string;
  timestamp: string; // Using string for mock data compatibility
  metadata?: Record<string, unknown>;
}

interface WorkOrderTimelineProps {
  events?: TimelineEvent[];
}

const eventIcons = {
  status_change: CheckCircle2,
  assignment: User,
  task_update: Wrench,
  comment: MessageSquare,
  attachment: FileText,
};

const eventColors = {
  status_change: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
  assignment: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
  task_update: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
  comment: "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800",
  attachment: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
};

export function WorkOrderTimeline({
  events = [],
}: WorkOrderTimelineProps) {
  const mockEvents: TimelineEvent[] = events.length > 0 ? events : [
    {
      id: "1",
      type: "status_change",
      title: "Work order created",
      description: "Status set to Pending",
      user: "Admin User",
      timestamp: "2024-11-24T09:00:00Z",
    },
    {
      id: "2",
      type: "assignment",
      title: "Assigned to technician",
      description: "Sarah Johnson assigned to this work order",
      user: "Supervisor",
      timestamp: "2024-11-24T09:15:00Z",
    },
    {
      id: "3",
      type: "status_change",
      title: "Status changed",
      description: "Status updated to In Progress",
      user: "Sarah Johnson",
      timestamp: "2024-11-25T08:30:00Z",
    },
    {
      id: "4",
      type: "comment",
      title: "Comment added",
      description: "Started work on brake inspection",
      user: "Sarah Johnson",
      timestamp: "2024-11-25T10:30:00Z",
    },
    {
      id: "5",
      type: "task_update",
      title: "Parts added",
      description: "Added brake pads and brake cleaner",
      user: "Sarah Johnson",
      timestamp: "2024-11-25T11:00:00Z",
    },
    {
      id: "6",
      type: "task_update",
      title: "Task completed",
      description: "Inspect brake lines marked as complete",
      user: "Sarah Johnson",
      timestamp: "2024-11-25T12:15:00Z",
    },
  ];

  if (mockEvents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No activity yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Activity Timeline
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete history of all changes and activities
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-6">
          {mockEvents.map((event) => {
            const Icon = eventIcons[event.type];
            const colorClass = eventColors[event.type];

            return (
              <div key={event.id} className="relative pl-12">
                {/* Timeline dot */}
                <div className={`absolute left-3 top-2 flex h-4 w-4 items-center justify-center rounded-full ${colorClass}`}>
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>

                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${colorClass}`} />
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {event.title}
                          </h4>
                        </div>
                        {event.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {event.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{formatDate(event.timestamp)}</span>
                          {event.user && (
                            <>
                              <span>•</span>
                              <span>{event.user}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
