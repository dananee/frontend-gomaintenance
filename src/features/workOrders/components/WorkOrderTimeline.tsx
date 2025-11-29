"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  MessageSquare,
  FileText,
  Wrench,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  type:
    | "status_change"
    | "comment"
    | "attachment"
    | "task_update"
    | "assignment";
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
  status_change:
    "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800",
  assignment:
    "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  task_update:
    "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
  comment:
    "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  attachment:
    "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
};

export function WorkOrderTimeline({ events = [] }: WorkOrderTimelineProps) {
  const mockEvents: TimelineEvent[] =
    events.length > 0
      ? events
      : [
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

  const getEventTypeLabel = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "status_change":
        return "Status";
      case "assignment":
        return "Assignment";
      case "task_update":
        return "Task";
      case "comment":
        return "Comment";
      case "attachment":
        return "Attachment";
      default:
        return "Event";
    }
  };

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
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete history of all changes and activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-6">
              {mockEvents.map((event, index) => {
                const Icon = eventIcons[event.type];
                const colorClass = eventColors[event.type];

                return (
                  <div key={event.id} className="relative pl-12">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-2.5 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 ${colorClass}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 transition-all hover:shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {event.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                          {event.description && (
                            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
                              {event.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(event.timestamp)}</span>
                            </div>
                            {event.user && (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{event.user}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
