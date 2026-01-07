"use client";

import { useMemo, useState } from "react";
import { formatCurrency, formatDateShort } from "@/lib/formatters";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { getVehicle } from "@/features/vehicles/api/getVehicle";
import { getVehicleDetails, VehicleDetailsResponse } from "@/features/vehicles/api/getVehicleDetails";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumMetricCard } from "@/components/ui/premium-metric-card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ServiceSummary } from "@/features/vehicles/components/ServiceSummary";
import { CostTrendChart } from "@/features/dashboard/components/CostTrendChart";
import { DowntimeChart } from "@/features/dashboard/components/DowntimeChart";
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
  Calendar,
  RefreshCw,
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
import { VehicleUnifiedHistory } from "@/features/vehicles/components/VehicleUnifiedHistory";
import { Modal } from "@/components/ui/modal";
import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { UpdateUsageModal } from "@/features/vehicles/components/UpdateUsageModal";
import { useUpdateVehicleUsage } from "@/features/vehicles/hooks/useUpdateVehicleUsage";
import {
  CreateMaintenancePlanRequest,
  VehicleMaintenancePlan,
} from "@/features/vehicles/api/vehiclePlans";
import { AddVehicleDocumentRequest } from "@/features/vehicles/api/vehicleDocuments";
import {
  useVehicleDrivers,
  useAssignDrivers,
  useUnassignDriver,
  useSetPrimaryDriver,
} from "@/features/vehicles/hooks/useVehicleDrivers";
import { VehicleDriversTab } from "@/features/vehicles/components/VehicleDriversTab";
import { useUsers } from "@/features/users/hooks/useUsers";
import { useTranslations } from "next-intl";
import { DataErrorPlaceholder } from "@/components/ui/data-error-placeholder";

export default function VehicleDetailPage() {
  const t = useTranslations("vehicles");
  const tVehicleTypes = useTranslations("vehicleTypes");
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<VehicleMaintenancePlan | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isWorkOrderModalOpen, setIsWorkOrderModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);

  // 1. Core Query: Minimal vehicle data for the header/shell
  const { data: basicVehicle, isLoading: isLoadingBasic, error: errorBasic } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => getVehicle(vehicleId),
    enabled: !!vehicleId,
  });

  // 2. Extended Query: Complex metrics, charts, and history
  const {
    data: extendedDetails,
    isLoading: isLoadingExtended,
    error: errorExtended,
    refetch: refetchExtended
  } = useQuery<VehicleDetailsResponse>({
    queryKey: ["vehicle-details", vehicleId],
    queryFn: () => getVehicleDetails(vehicleId),
    enabled: !!vehicleId,
    // Add retries for the complex query
    retry: 1,
  });

  const { data: plans, isLoading: isLoadingPlans } = useVehicleMaintenancePlans(vehicleId);
  const { mutate: createPlan, isPending: isCreatingPlan } = useCreateVehicleMaintenancePlan(vehicleId);
  const { mutate: updatePlan, isPending: isUpdatingPlan } = useUpdateVehicleMaintenancePlan(vehicleId);
  const { mutate: removePlan, isPending: isDeletingPlan } = useDeleteVehicleMaintenancePlan(vehicleId);

  const { data: documents = [], isLoading: isLoadingDocuments } = useVehicleDocuments(vehicleId);
  const { mutate: uploadDocument, isPending: isUploadingDocument } = useUploadVehicleDocument(vehicleId);
  const { mutate: deleteDocument, isPending: isDeletingDocument } = useDeleteVehicleDocument(vehicleId);

  const { data: drivers = [], isLoading: isLoadingDrivers } = useVehicleDrivers(vehicleId);
  const { mutate: assignDrivers, isPending: isAssigningDrivers } = useAssignDrivers(vehicleId);
  const { mutate: unassignDriver, isPending: isUnassigningDriver } = useUnassignDriver(vehicleId);
  const { mutate: setPrimaryDriver, isPending: isSettingPrimary } = useSetPrimaryDriver(vehicleId);

  // Fetch all users to select drivers from
  const { data: usersData, isLoading: isLoadingUsers } = useUsers({ page_size: 100 });

  const availableDrivers = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.map(u => {
      const nameParts = (u.name || "").split(" ");
      return {
        id: u.id,
        first_name: u.first_name || nameParts[0] || "",
        last_name: u.last_name || nameParts.slice(1).join(" ") || "",
        email: u.email,
        phone: "", // Phone number not available on User type yet
        avatar_url: u.avatar || "",
      };
    });
  }, [usersData]);

  const { mutate: updateUsage, isPending: isUpdatingUsage } = useUpdateVehicleUsage(vehicleId);

  const isLoading = isLoadingBasic && !basicVehicle;

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

  // Only fail the entire page if the basic info query fails
  if (errorBasic && !basicVehicle) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Failed to load vehicle basic information</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // If we don't have basic vehicle data, we can't render the shell
  if (!basicVehicle) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Vehicle not found</p>
        <Button onClick={() => router.push("/dashboard/vehicles")}>Back to Vehicles</Button>
      </div>
    );
  }

  // Safe data extraction for the shell
  const vehicle = basicVehicle;

  // Safe data extraction for extended details with fallbacks
  const metrics = extendedDetails?.metrics || {
    averageRepairCost: 0,
    costPerKm: 0,
    mtbf: 0,
    reliabilityScore: 0,
    totalDowntimeHours: 0,
    mttr: 0,
    totalWorkOrders: 0,
  };
  const serviceSummary = extendedDetails?.serviceSummary || {
    lastMaintenanceDate: null,
    lastMaintenanceCost: 0,
    nextServiceDue: null,
    lastTechnicianName: null,
    serviceInterval: null,
  };
  const charts = extendedDetails?.charts || {
    maintenanceCostTrend: [],
    downtimeTrend: [],
    mileageGrowth: [],
  };
  const partsUsed = extendedDetails?.partsUsed || [];


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

  const handleAssignDrivers = async (driverIds: string[], primaryDriverId?: string) => {
    assignDrivers(
      { driver_ids: driverIds, primary_driver_id: primaryDriverId },
      {
        onSuccess: () => toast.success("Drivers assigned successfully"),
        onError: () => toast.error("Failed to assign drivers"),
      }
    );
  };

  const handleUnassignDriver = async (driverId: string) => {
    unassignDriver(driverId, {
      onSuccess: () => toast.success("Driver unassigned successfully"),
      onError: () => toast.error("Failed to unassign driver"),
    });
  };

  const handleSetPrimary = async (driverId: string) => {
    setPrimaryDriver(driverId, {
      onSuccess: () => toast.success("Primary driver updated"),
      onError: () => toast.error("Failed to update primary driver"),
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
            <span className="capitalize">
              {vehicle.vehicle_type?.code && vehicle.vehicle_type?.name ? (
                tVehicleTypes.has(vehicle.vehicle_type.code) ? tVehicleTypes(vehicle.vehicle_type.code) : vehicle.vehicle_type.name
              ) : vehicle.type || 'Unknown'}
            </span>
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
              value="drivers"
              className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
            >
              {t("drivers.title")}
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
            {!extendedDetails?.metrics ? (
              <Card>
                <CardContent className="p-6">
                  <DataErrorPlaceholder
                    message="Failed to load performance metrics"
                    onRetry={() => refetchExtended()}
                    size="md"
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                <PremiumMetricCard
                  title={t("details.metrics.avgRepairCost")}
                  value={metrics.averageRepairCost}
                  suffix="MAD"
                  decimals={2}
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
                      <AnimatedNumber value={metrics.costPerKm} currency="MAD" decimals={3} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("details.metrics.perWorkOrder")}: <AnimatedNumber value={metrics.averageRepairCost} currency="MAD" />
                    </p>
                  </CardContent>
                </Card>
                <PremiumMetricCard
                  title={t("details.metrics.mtbf")}
                  value={metrics.mtbf}
                  suffix="h"
                  decimals={0}
                  subtitle={t("details.metrics.meanTimeBetweenFailures")}
                  icon={Zap}
                  variant="green"
                />
                <PremiumMetricCard
                  title={t("details.metrics.reliabilityScore")}
                  value={metrics.reliabilityScore}
                  suffix="%"
                  decimals={1}
                  icon={Zap}
                  variant="teal"
                />
                <PremiumMetricCard
                  title={t("details.metrics.totalDowntime")}
                  value={metrics.totalDowntimeHours}
                  suffix="h"
                  decimals={1}
                  icon={Clock}
                  variant="orange"
                />
                <PremiumMetricCard
                  title={t("details.metrics.mttr")}
                  value={metrics.mttr}
                  suffix="h"
                  decimals={1}
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
            )}
          </div>

          {!extendedDetails?.serviceSummary ? (
            <Card>
              <CardContent className="p-6">
                <DataErrorPlaceholder
                  message="Failed to load service summary"
                  onRetry={() => refetchExtended()}
                  size="md"
                />
              </CardContent>
            </Card>
          ) : (
            <ServiceSummary
              lastMaintenanceDate={serviceSummary.lastMaintenanceDate || "—"}
              lastMaintenanceCost={serviceSummary.lastMaintenanceCost || 0}
              nextServiceDue={serviceSummary.nextServiceDue || "—"}
              lastTechnician={serviceSummary.lastTechnicianName || "—"}
              serviceInterval={serviceSummary.serviceInterval || "—"}
            />
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold">{t("details.analytics.title")}</h2>
            {!extendedDetails?.charts ? (
              <Card>
                <CardContent className="p-6">
                  <DataErrorPlaceholder
                    message="Failed to load analytics charts"
                    onRetry={() => refetchExtended()}
                    size="md"
                  />
                </CardContent>
              </Card>
            ) : (
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
            )}
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">{t("details.partsUsed.title")}</h2>
            {!extendedDetails?.partsUsed ? (
              <Card>
                <CardContent className="p-6">
                  <DataErrorPlaceholder
                    message="Failed to load parts usage data"
                    onRetry={() => refetchExtended()}
                    size="md"
                  />
                </CardContent>
              </Card>
            ) : (
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
                        {partsUsed.length === 0 ? (
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
                              <TableCell>
                                <AnimatedNumber value={part.quantity} decimals={0} />
                              </TableCell>
                              <TableCell className="font-medium">
                                <AnimatedNumber value={part.cost} currency="MAD" />
                              </TableCell>
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
            )}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Upcoming Individual Tasks */}
          {extendedDetails?.upcomingMaintenance && extendedDetails.upcomingMaintenance.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">{t("details.tabs.upcomingTasks") || "Upcoming Tasks"}</h2>
              </div>
              <div className="grid gap-3">
                {extendedDetails.upcomingMaintenance.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-gray-900/40 border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateShort(event.scheduled_date)}
                          </span>
                          {event.priority && (
                            <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 h-4">
                              {event.priority}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/maintenance">
                        {t("details.actions.view") || "View"}
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t("details.tabs.plans") || "Recurrent Plans"}</h2>
          </div>

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

        <TabsContent value="drivers" className="space-y-6">
          {isLoadingDrivers || isLoadingUsers ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <VehicleDriversTab
              vehicleId={vehicleId}
              drivers={drivers || []}
              availableDrivers={availableDrivers}
              onAssignDrivers={handleAssignDrivers}
              onUnassignDriver={handleUnassignDriver}
              onSetPrimary={handleSetPrimary}
              isLoading={isAssigningDrivers || isUnassigningDriver || isSettingPrimary}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <VehicleUnifiedHistory vehicleId={vehicleId} />
        </TabsContent>
      </Tabs>

      <CreateMaintenancePlanModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={handlePlanSubmit}
        plan={selectedPlan || undefined}
        meterUnit={vehicle.meter_unit || "km"}
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
          vehicle={vehicle}
        />
      </Modal>

      <UpdateUsageModal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        onSubmit={handleUsageUpdate}
        isSubmitting={isUpdatingUsage}
        currentKm={vehicle.current_km || 0}
      />
    </div>
  );
}
