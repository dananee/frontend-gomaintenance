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
  Loader2,
  History,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listWorkOrderActivity } from "../api/workOrderActivity";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export function WorkOrderTimeline() {
  const params = useParams();
  const workOrderId = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ["workOrderActivity", workOrderId],
    queryFn: () => listWorkOrderActivity(workOrderId),
    enabled: !!workOrderId,
  });

  const logs = data?.data || [];

  const getEventIcon = (action: string) => {
    if (action.includes("status")) return CheckCircle2;
    if (action.includes("assign")) return User;
    if (action.includes("task")) return Wrench;
    if (action.includes("comment")) return MessageSquare;
    if (action.includes("attachment")) return FileText;
    if (action.includes("create")) return AlertCircle;
    return Clock;
  };

  const getEventColor = (action: string) => {
    if (action.includes("status"))
      return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
    if (action.includes("assign"))
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800";
    if (action.includes("task"))
      return "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800";
    if (action.includes("comment"))
      return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    if (action.includes("attachment"))
      return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800";
    return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm bg-white dark:bg-gray-950">
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="border-none shadow-sm bg-white dark:bg-gray-950">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-full mb-4">
            <History className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No activity yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Actions and updates performed on this work order will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm bg-white dark:bg-gray-950">
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Activity Timeline
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Complete history of all changes and activities
          </p>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="relative pl-4">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800" />

            <div className="space-y-8">
              {logs.map((log, index) => {
                const Icon = getEventIcon(log.action);
                const colorClass = getEventColor(log.action);

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative pl-10"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 z-10 bg-white dark:bg-gray-950 p-1">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="group rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 p-4 transition-all hover:bg-white hover:shadow-md dark:hover:bg-gray-900">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                              {formatAction(log.action)}
                            </h4>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {log.entity_type}
                            </Badge>
                          </div>
                          
                          {log.changes && (
                            <div className="mt-2 text-xs font-mono bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded p-2 text-gray-600 dark:text-gray-400 overflow-x-auto">
                              {(() => {
                                try {
                                  const parsed = JSON.parse(log.changes);
                                  return (
                                    <div className="space-y-1">
                                      {Object.entries(parsed).map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                          <span className="font-semibold text-gray-500">{key}:</span>
                                          <span>{String(value)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                } catch {
                                  return log.changes;
                                }
                              })()}
                            </div>
                          )}

                          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDate(log.created_at)}</span>
                            </div>
                            {log.user && (
                              <div className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  {log.user.first_name} {log.user.last_name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
