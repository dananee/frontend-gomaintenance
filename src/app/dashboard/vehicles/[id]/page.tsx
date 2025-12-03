"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { getVehicleDetails, VehicleDetailsResponse } from "@/features/vehicles/api/getVehicleDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleKPICard } from "@/features/vehicles/components/VehicleKPICard";
import { ServiceSummary } from "@/features/vehicles/components/ServiceSummary";
import { CostTrendChart } from "@/features/dashboard/components/CostTrendChart";
import { DowntimeChart } from "@/features/dashboard/components/DowntimeChart";
import { WorkOrderPieChart } from "@/features/dashboard/components/WorkOrderPieChart";
import {
  ArrowLeft,
  DollarSign,
  Wrench,
  Clock,
  Timer,
  Zap,
  TrendingDown,
  Package,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleMaintenancePlans } from "@/features/vehicles/components/VehicleMaintenancePlans";
import { CreateMaintenancePlanModal } from "@/features/vehicles/components/CreateMaintenancePlanModal";
import {
  useVehicleMaintenancePlans,
  useCreateVehicleMaintenancePlan,
  useUpdateVehicleMaintenancePlan,
  useDeleteVehicleMaintenancePlan,
} from "@/features/vehicles/hooks/useVehiclePlans";
import { VehicleDocuments } from "@/features/vehicles/components/VehicleDocuments";
import { UploadDocumentModal } from "@/features/vehicles/components/UploadDocumentModal";
import {
  useVehicleDocuments,
  useUploadVehicleDocument,
  useDeleteVehicleDocument,
} from "@/features/vehicles/hooks/useVehicleDocuments";
import { VehicleActivityTimeline } from "@/features/vehicles/components/VehicleActivityTimeline";
import { VehicleMaintenanceHistory } from "@/features/vehicles/components/VehicleMaintenanceHistory";
import { Modal } from "@/components/ui/modal";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { UpdateUsageModal } from "@/features/vehicles/components/UpdateUsageModal";
import { useUpdateVehicleUsage } from "@/features/vehicles/hooks/useUpdateVehicleUsage";
import {
  CreateMaintenancePlanRequest,
  VehicleMaintenancePlan,
} from "@/features/vehicles/api/vehiclePlans";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<VehicleMaintenancePlan | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<VehicleDetailsResponse>({
    queryKey: ["vehicle-details", vehicleId],
    queryFn: () => getVehicleDetails(vehicleId),
    enabled: !!vehicleId,
  });

  const { data: plans, isLoading: isLoadingPlans } = useVehicleMaintenancePlans(vehicleId);
  const { mutate: createPlan, isPending: isCreatingPlan } = useCreateVehicleMaintenancePlan(vehicleId);
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdateVehicleMaintenancePlan(vehicleId);
  const { mutate: removePlan, isPending: isDeletingPlan } = useDeleteVehicleMaintenancePlan(vehicleId);

  const { data: documents = [], isLoading: isLoadingDocuments } = useVehicleDocuments(vehicleId);
  const { mutate: uploadDocument, isPending: isUploadingDocument } = useUploadVehicleDocument(vehicleId);
  const { mutate: deleteDocument, isPending: isDeletingDocument } = useDeleteVehicleDocument(vehicleId);

  const { mutate: updateUsage, isPending: isUpdatingUsage } = useUpdateVehicleUsage(vehicleId);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Failed to load vehicle details</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const { vehicle, metrics, serviceSummary, charts, partsUsed, maintenanceHistory, activityLog } = data;

  const maintenanceRecords = useMemo(() => {
    const records = maintenanceHistory ? [...maintenanceHistory] : [];

    if (!maintenanceHistory?.length && serviceSummary.lastMaintenanceDate) {
      records.push({
        id: "last-service",
        type: "Service",
        description: serviceSummary.lastTechnicianName || "Maintenance completed",
        date: serviceSummary.lastMaintenanceDate,
        mileage: vehicle.mileage,
        cost: serviceSummary.lastMaintenanceCost,
        status: "completed" as const,
      });
    }

    return records;
  }, [maintenanceHistory, serviceSummary.lastMaintenanceCost, serviceSummary.lastMaintenanceDate, serviceSummary.lastTechnicianName, vehicle.mileage]);

  const activityEvents = useMemo(
    () => [
      ...(activityLog || []),
      ...(partsUsed || []).map((part, index) => ({
        id: `part-${index}`,
        title: `Part used: ${part.partName}`,
        description: `Work order ${part.workOrderId} • Qty ${part.quantity} • $${part.cost.toLocaleString()}`,
        date: part.dateUsed,
        type: "parts",
      })),
    ],
    [activityLog, partsUsed]
  );

  const handlePlanSubmit = (payload: CreateMaintenancePlanRequest) => {
    if (selectedPlan) {
      updatePlan(
        { planId: selectedPlan.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Plan updated");
            setIsPlanModalOpen(false);
            setSelectedPlan(null);
          },
          onError: () => toast.error("Unable to save maintenance plan"),
        }
      );
      return;
    }

    createPlan(payload, {
      onSuccess: () => {
        toast.success("Plan created");
        setIsPlanModalOpen(false);
      },
      onError: () => toast.error("Unable to save maintenance plan"),
    });
  };

  const handlePlanDelete = (planId: string) => {
    removePlan(planId, {
      onSuccess: () => toast.success("Plan deleted"),
      onError: () => toast.error("Unable to delete plan"),
    });
  };

  const handleUpload = (payload: { name: string; type: string; file_url: string }) => {
    uploadDocument(payload, {
      onSuccess: () => {
        toast.success("Document uploaded");
        setIsUploadModalOpen(false);
      },
      onError: () => toast.error("Unable to upload document"),
    });
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId, {
      onSuccess: () => toast.success("Document deleted"),
      onError: () => toast.error("Unable to delete document"),
    });
  };

  const handleUsageUpdate = (payload: { current_km?: number; current_engine_hours?: number }) => {
    updateUsage(payload, {
      onSuccess: () => {
        toast.success("Usage updated");
        setIsUsageModalOpen(false);
      },
      onError: () => toast.error("Unable to update usage"),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {vehicle.year} {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-muted-foreground">
              {vehicle.plate_number} • VIN: {vehicle.vin} • {vehicle.status.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setIsUsageModalOpen(true)}>
            Update Usage
          </Button>
          <Link href={`/dashboard/vehicles/${vehicleId}/edit`}>
            <Button variant="outline">Edit Vehicle</Button>
          </Link>
          <Button onClick={() => setIsWorkOrderModalOpen(true)}>Create Work Order</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Maintenance Plans</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Performance Metrics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <VehicleKPICard
                title="Total Maintenance Cost"
                value={`$${metrics.totalMaintenanceCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                icon={DollarSign}
                className="bg-[#7C3AED] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-purple-200"
              />
              <VehicleKPICard
                title="Avg Repair Cost"
                value={`$${metrics.averageRepairCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                subtitle="Per work order"
                icon={Wrench}
                className="bg-[#6366F1] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-indigo-200"
              />
              <VehicleKPICard
                title="Cost per KM"
                value={`$${metrics.costPerKm.toFixed(2)}`}
                icon={TrendingDown}
                className="bg-[#3B82F6] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-blue-200"
              />
              <VehicleKPICard
                title="MTBF"
                value={`${metrics.mtbf.toFixed(0)}h`}
                subtitle="Mean Time Between Failures"
                icon={Zap}
                className="bg-[#10B981] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-emerald-200"
              />
              <VehicleKPICard
                title="Reliability Score"
                value={`${metrics.reliabilityScore.toFixed(1)}%`}
                icon={Zap}
                className="bg-[#14B8A6] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-teal-200"
              />
              <VehicleKPICard
                title="Total Downtime"
                value={`${metrics.totalDowntimeHours.toFixed(1)}h`}
                icon={Clock}
                className="bg-[#F97316] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-orange-200"
              />
              <VehicleKPICard
                title="MTTR"
                value={`${metrics.mttr.toFixed(1)}h`}
                subtitle="Mean Time To Repair"
                icon={Timer}
                className="bg-[#F43F5E] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-rose-200"
              />
              <VehicleKPICard
                title="Work Orders"
                value={metrics.totalWorkOrders}
                subtitle="Total completed"
                icon={Wrench}
                className="bg-[#64748B] text-white shadow-lg/20 transition-transform duration-200 hover:scale-[1.01]"
                iconClassName="text-slate-200"
              />
            </div>
          </div>

          <ServiceSummary
            lastMaintenanceDate={serviceSummary.lastMaintenanceDate || "—"}
            lastMaintenanceCost={serviceSummary.lastMaintenanceCost || 0}
            nextServiceDue={serviceSummary.nextServiceDue || "—"}
            lastTechnician={serviceSummary.lastTechnicianName || "—"}
            serviceInterval={serviceSummary.serviceInterval || "—"}
          />

          <div>
            <h2 className="mb-4 text-xl font-semibold">Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <CostTrendChart
                data={(charts.maintenanceCostTrend || []).map((item) => ({
                  month: item.date,
                  value: item.value,
                  label: `$${item.value.toFixed(0)}`,
                }))}
              />
              <DowntimeChart
                data={(charts.downtimeTrend || []).map((item) => ({
                  month: item.date,
                  value: item.value,
                  label: `${item.value.toFixed(0)}h`,
                }))}
              />
              <WorkOrderPieChart
                data={(charts.workOrderDistribution || []).map((item) => ({
                  status: item.name,
                  count: item.value,
                  percentage: metrics.totalWorkOrders > 0 ? (item.value / metrics.totalWorkOrders) * 100 : 0,
                  color:
                    item.name === "preventive"
                      ? "#10b981"
                      : item.name === "corrective"
                      ? "#f59e0b"
                      : item.name === "breakdown"
                      ? "#ef4444"
                      : "#3b82f6",
                }))}
              />
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold">Mileage Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[240px] items-center justify-center text-muted-foreground">
                    {(charts.mileageGrowth || []).length > 0 ? (
                      <p>Chart data available</p>
                    ) : (
                      <p>No mileage history available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Parts Used & Costs</h2>
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead className="font-semibold">Part Name</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Cost</TableHead>
                        <TableHead className="font-semibold">Date Used</TableHead>
                        <TableHead className="font-semibold">Work Order</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(partsUsed || []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                            No parts used yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        partsUsed.map((part, index) => (
                          <TableRow
                            key={index}
                            className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/30"
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                {part.partName}
                              </div>
                            </TableCell>
                            <TableCell>{part.quantity}</TableCell>
                            <TableCell className="font-medium">${part.cost.toLocaleString()}</TableCell>
                            <TableCell>{new Date(part.dateUsed).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Link
                                href={`/dashboard/work-orders/${part.workOrderId}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                View Work Order
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <VehicleMaintenancePlans
            plans={plans || []}
            isLoading={isLoadingPlans}
            isDeleting={isDeletingPlan}
            onCreate={() => {
              setSelectedPlan(null);
              setIsPlanModalOpen(true);
            }}
            onEdit={(plan) => {
              setSelectedPlan(plan);
              setIsPlanModalOpen(true);
            }}
            onDelete={handlePlanDelete}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {isLoadingDocuments ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <VehicleDocuments
              documents={documents}
              onUpload={() => setIsUploadModalOpen(true)}
              onDelete={handleDeleteDocument}
              isDeleting={isDeletingDocument}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <VehicleActivityTimeline events={activityEvents} />
          <VehicleMaintenanceHistory records={maintenanceRecords} />
        </TabsContent>
      </Tabs>

      <CreateMaintenancePlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={handlePlanSubmit}
        isSubmitting={isCreatingPlan || isUpdatingPlan}
        plan={selectedPlan || undefined}
      />

      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
        isSubmitting={isUploadingDocument}
      />

      <Modal
        isOpen={isWorkOrderModalOpen}
        onClose={() => setIsWorkOrderModalOpen(false)}
        title="Create Work Order"
      >
        <WorkOrderForm
          onSuccess={() => setIsWorkOrderModalOpen(false)}
          onCancel={() => setIsWorkOrderModalOpen(false)}
          vehicleId={vehicle.id}
        />
      </Modal>

      <UpdateUsageModal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        onSubmit={handleUsageUpdate}
        isSubmitting={isUpdatingUsage}
        currentKm={vehicle.mileage}
      />
    </div>
  );
}
