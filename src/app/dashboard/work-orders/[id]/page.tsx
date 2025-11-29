"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  CalendarRange,
  Pencil,
  User,
  Wrench,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DetailPageSkeleton } from "@/components/ui/skeleton";
import { useModal } from "@/hooks/useModal";
import { WorkOrderTasks } from "@/features/workOrders/components/WorkOrderTasks";
import { WorkOrderAttachments } from "@/features/workOrders/components/WorkOrderAttachments";
import { WorkOrderTimeline } from "@/features/workOrders/components/WorkOrderTimeline";
import { WorkOrderComments } from "@/features/workOrders/components/WorkOrderComments";

export default function WorkOrderDetailsPage() {
  const { isOpen, open, close } = useModal();
  const [isLoading] = useState(false); // Can be connected to actual loading state

  const workOrder = useMemo(
    () => ({
      id: "WO-214",
      title: "Brake inspection & pad replacement",
      priority: "high",
      status: "in_progress",
      vehicle: "Freightliner Cascadia",
      vehicleId: "VH-001",
      due: "Mar 20",
      assignee: "Alex Turner",
    }),
    []
  );

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {workOrder.title}
            </h1>
            <Badge variant="secondary" className="capitalize">
              {workOrder.status.replace("_", " ")}
            </Badge>
            <Badge className="capitalize">Priority: {workOrder.priority}</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {workOrder.id} · Due {workOrder.due}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={open}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Work Order
          </Button>
          <Button>
            <BadgeCheck className="mr-2 h-4 w-4" /> Mark Complete
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Activity className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">
                  {workOrder.status.replace("_", " ")}
                </div>
                <p className="text-xs text-gray-500">Updated today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Date</CardTitle>
                <CalendarRange className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workOrder.due}</div>
                <p className="text-xs text-gray-500">Timeline commitment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vehicle</CardTitle>
                <Wrench className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workOrder.vehicle}</div>
                <p className="text-xs text-gray-500">Linked asset</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignee</CardTitle>
                <User className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">
                    {workOrder.assignee}
                  </div>
                  <p className="text-xs text-gray-500">Technician</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700">
                <p className="text-gray-500">Symptoms</p>
                <p className="mt-2 text-gray-900 dark:text-gray-100">
                  Driver reported vibration when braking at highway speeds.
                  Initial inspection showed uneven pad wear.
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 text-sm dark:border-gray-700">
                <p className="text-gray-500">Resolution Plan</p>
                <p className="mt-2 text-gray-900 dark:text-gray-100">
                  Replace front pads, resurface rotors if needed, and perform
                  road test to confirm noise resolved.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <WorkOrderTasks
            workOrderId={workOrder.id}
            onTaskToggle={(taskId, completed) => {
              console.log(`Task ${taskId} toggled:`, completed);
            }}
          />
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <WorkOrderAttachments workOrderId={workOrder.id} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <WorkOrderTimeline />
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <WorkOrderComments />
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Edit Work Order"
        description="Update work order status, assignee, or due date."
      >
        <div className="space-y-4">
          <Input placeholder="Title" defaultValue={workOrder.title} />
          <Input placeholder="Due date" defaultValue={workOrder.due} />
          <div className="flex justify-end">
            <Button onClick={close}>Save changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
