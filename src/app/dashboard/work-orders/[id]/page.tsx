"use client";

import { useParams } from "next/navigation";
import {
  Activity,
  BadgeCheck,
  CalendarRange,
  Pencil,
  User,
  Wrench,
  ChevronRight,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertTriangle,
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
import { useWorkOrder } from "@/features/workOrders/hooks/useWorkOrder";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function WorkOrderDetailsPage() {
  const params = useParams();
  const workOrderId = params.id as string;
  const { isOpen, open, close } = useModal();
  
  const { data: workOrder, isLoading } = useWorkOrder(workOrderId);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!workOrder) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full inline-flex">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Work Order Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400">The requested work order could not be located.</p>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "in_progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "cancelled": return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
      default: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "critical": return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50";
      case "high": return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/50";
      case "medium": return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50";
      default: return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 py-6">
        
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {workOrder.title}
                </h1>
                <Badge 
                  variant="secondary" 
                  className={`capitalize px-3 py-1 text-sm font-medium border ${getStatusColor(workOrder.status)}`}
                >
                  {workOrder.status.replace("_", " ")}
                </Badge>
                <Badge 
                  variant="outline"
                  className={`capitalize px-3 py-1 text-sm font-medium ${getPriorityColor(workOrder.priority)}`}
                >
                  {workOrder.priority} Priority
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {workOrder.vehicle_name || "Unknown Vehicle"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4" />
                  <span>
                    Due {workOrder.scheduled_date ? formatDate(workOrder.scheduled_date) : "No date"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    {workOrder.assigned_to_name || "Unassigned"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={open} className="shadow-sm bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Pencil className="mr-2 h-4 w-4" /> Edit Details
              </Button>
              <Button className="shadow-sm bg-blue-600 hover:bg-blue-700 text-white transition-all">
                <BadgeCheck className="mr-2 h-4 w-4" /> Mark Complete
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start border-b border-gray-200 dark:border-gray-800 bg-transparent p-0 h-auto rounded-none space-x-6 overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-2 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-2 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
            <TabsTrigger 
              value="attachments" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-2 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Paperclip className="h-4 w-4 mr-2" />
              Attachments
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-2 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger 
              value="comments" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-2 py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</CardTitle>
                  <Activity className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold capitalize text-gray-900 dark:text-white">
                    {workOrder.status.replace("_", " ")}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current workflow stage</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</CardTitle>
                  <CalendarRange className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {workOrder.scheduled_date ? formatDate(workOrder.scheduled_date) : "No date"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Target completion</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Vehicle</CardTitle>
                  <Wrench className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-gray-900 dark:text-white truncate" title={workOrder.vehicle_name}>
                    {workOrder.vehicle_name || "Unknown"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Linked asset</p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignee</CardTitle>
                  <User className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent className="flex items-center gap-3">
                  {workOrder.assigned_to_name ? (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {workOrder.assigned_to_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {workOrder.assigned_to_name}
                        </div>
                        <p className="text-xs text-gray-500">Technician</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Not assigned</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Details & Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Work Order Type</label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-900 dark:text-gray-100 capitalize font-medium">
                        {workOrder.type}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority Level</label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-900 dark:text-gray-100 capitalize font-medium">
                        {workOrder.priority}
                      </p>
                    </div>
                  </div>
                </div>
                
                {workOrder.description && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                        {workOrder.description}
                      </p>
                    </div>
                  </div>
                )}
                
                {workOrder.notes && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Notes</label>
                    <div className="p-4 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/20">
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                        {workOrder.notes}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
            <WorkOrderTasks />
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
            <WorkOrderAttachments workOrderId={workOrder.id} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
            <WorkOrderTimeline />
          </TabsContent>

          <TabsContent value="comments" className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
            <WorkOrderComments workOrderId={workOrder.id} />
          </TabsContent>
        </Tabs>

        <Modal
          isOpen={isOpen}
          onClose={close}
          title="Edit Work Order"
          description="Update work order status, assignee, or due date."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Title" defaultValue={workOrder.title} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                placeholder="Due date" 
                defaultValue={workOrder.scheduled_date || ""} 
                type="datetime-local"
                step="60" // Enable seconds/24h format support
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={close}>Save changes</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
