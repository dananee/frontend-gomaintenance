"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatDateShort } from "@/lib/formatters";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { getVehicleDetails, VehicleDetailsResponse } from "@/features/vehicles/api/getVehicleDetails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumMetricCard } from "@/components/ui/premium-metric-card";
import { ServiceSummary } from "@/features/vehicles/components/ServiceSummary";
import { CostTrendChart } from "@/features/dashboard/components/CostTrendChart";
import { DowntimeChart } from "@/features/dashboard/components/DowntimeChart";
import { WorkOrderPieChart } from "@/features/dashboard/components/WorkOrderPieChart";
import {
  Activity,
  CalendarRange,
  Clock,
  DollarSign,
  FileText,
  History,
  LayoutDashboard,
  ShieldCheck,
  Timer,
  Zap,
  TrendingDown,
  TrendingUp,
  Wrench,
  Pencil,
  ArrowLeft,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/premium-tabs";
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
import { AddVehicleDocumentRequest } from "@/features/vehicles/api/vehicleDocuments";
import { useTranslations } from "next-intl";

export default function VehicleDetailPage() {
  const t = useTranslations("vehicles");
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

  const maintenanceRecords = useMemo(() => {
    if (!data) return [];
    const { maintenanceHistory, serviceSummary, vehicle } = data;
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
  }, [data]);

  const activityEvents = useMemo(() => {
    if (!data) return [];
    const { activityLog, partsUsed } = data;
    return [
      ...(activityLog || []),
      ...(partsUsed || []).map((part, index) => ({
        id: `part-${index}`,
        title: `Part used: ${part.partName}`,
        description: `Work order ${part.workOrderId} • Qty ${part.quantity} • ${formatCurrency(part.cost)}`,
        date: part.dateUsed,
        type: "parts",
      })),
    ];
  }, [data]);

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

  const { vehicle, metrics, serviceSummary, charts, partsUsed } = data!;

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

  const handleUpload = (payload: AddVehicleDocumentRequest) => {
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

  const handleEdit = () => router.push(`/dashboard/vehicles/${vehicleId}/edit`);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {vehicle.brand} {vehicle.model}
            </h1>
            <Badge
              variant={vehicle.status === "active" ? "success" : "secondary"}
              className="capitalize"
            >
              {t(`filters.status.${vehicle.status}`) || vehicle.status}
            </Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm">
              {vehicle.plate_number}
            </span>
            <span>•</span>
            <span>{vehicle.year}</span>
            <span>•</span>
            <span className="capitalize">{t(`filters.type.${vehicle.type}`) || vehicle.type}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            {t("actions.edit")}
          </Button>
          <Button onClick={() => setIsWorkOrderModalOpen(true)}>
            <Wrench className="mr-2 h-4 w-4" />
            {t("actions.createWorkOrder")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 border-b pb-1">
          <TabsList className="w-full justify-start gap-6 rounded-none border-b-2 border-transparent bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {t("details.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {t("details.tabs.plans")}
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {t("details.tabs.documents")}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {t("details.tabs.history")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold">{t("details.performanceMetrics.title")}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("details.metrics.totalCost")}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.totalMaintenanceCost)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("details.metrics.avgRepair")}: {formatCurrency(metrics.averageRepairCost)}
                  </p>
                </CardContent>
              </Card>
              <PremiumMetricCard
                title={t("details.metrics.avgRepairCost")}
                value={formatCurrency(metrics.averageRepairCost)}
                subtitle={t("details.metrics.perWorkOrder")}
                icon={Wrench}
                variant="indigo"
              />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("details.metrics.costPerKm")}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(metrics.costPerKm)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("details.metrics.perWorkOrder")}: {formatCurrency(metrics.averageRepairCost)}
                  </p>
                </CardContent>
              </Card>
              <PremiumMetricCard
                title={t("details.metrics.mtbf")}
                value={`${metrics.mtbf.toFixed(0)}h`}
                subtitle={t("details.metrics.meanTimeBetweenFailures")}
                icon={Zap}
                variant="green"
              />
              <PremiumMetricCard
                title={t("details.metrics.reliabilityScore")}
                value={`${metrics.reliabilityScore.toFixed(1)}%`}
                icon={Zap}
                variant="teal"
              />
              <PremiumMetricCard
                title={t("details.metrics.totalDowntime")}
                value={`${metrics.totalDowntimeHours.toFixed(1)}h`}
                icon={Clock}
                variant="orange"
              />
              <PremiumMetricCard
                title={t("details.metrics.mttr")}
                value={`${metrics.mttr.toFixed(1)}h`}
                subtitle={t("details.metrics.meanTimeToRepair")}
                icon={Timer}
                variant="rose"
              />
              <PremiumMetricCard
                title={t("details.metrics.workOrders")}
                value={metrics.totalWorkOrders}
                subtitle={t("details.metrics.totalCompleted")}
                icon={Wrench}
                variant="slate"
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
            <h2 className="mb-4 text-xl font-semibold">{t("details.analytics.title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <CostTrendChart
                data={(charts.maintenanceCostTrend || []).map((item) => ({
                  month: item.date,
                  value: item.value,
                  label: formatCurrency(item.value),
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
                  <CardTitle className="text-xl font-semibold">{t("details.analytics.mileageGrowth")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[240px] items-center justify-center text-muted-foreground">
                    {(charts.mileageGrowth || []).length > 0 ? (
                      <p>{t("details.analytics.chartDataAvailable")}</p>
                    ) : (
                      <p>{t("details.analytics.noMileageHistory")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">{t("details.partsUsed.title")}</h2>
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                        <TableHead className="font-semibold">{t("details.partsUsed.partName")}</TableHead>
                        <TableHead className="font-semibold">{t("details.partsUsed.quantity")}</TableHead>
                        <TableHead className="font-semibold">{t("details.partsUsed.cost")}</TableHead>
                        <TableHead className="font-semibold">{t("details.partsUsed.dateUsed")}</TableHead>
                        <TableHead className="font-semibold">{t("details.partsUsed.workOrder")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(partsUsed || []).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                            {t("details.partsUsed.noPartsUsed")}
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
                            <TableCell className="font-medium">{formatCurrency(part.cost)}</TableCell>
                            <TableCell>{formatDateShort(part.dateUsed)}</TableCell>
                            <TableCell>
                              <Link
                                href={`/dashboard/work-orders/${part.workOrderId}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {t("details.partsUsed.viewWorkOrder")}
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
