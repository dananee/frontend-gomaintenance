"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatters";
import { 
  Activity,
  Archive,
  Boxes,
  FileUp,
  Package2,
  Pencil,
  TrendingDown,
  TrendingUp,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Tag,
  Coins,
  Truck,
  Calendar,
  CheckCircle2
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DetailPageSkeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useModal } from "@/hooks/useModal";
import { StockAdjustmentModal } from "@/features/inventory/components/StockAdjustmentModal";
import { CreateStockMovementRequest, Part } from "@/features/inventory/types/inventory.types";

import { PremiumMetricCard } from "@/components/ui/premium-metric-card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// API Imports
import { getPart } from "@/features/inventory/api/getPart";
import { getStockMovements } from "@/features/inventory/api/inventory";
import { 
  getPartStock, 
  getPartDocuments, 
  getPartComments, 
  addPartComment,
  addPartDocument,
  adjustPartStock,
  updatePart 
} from "@/features/inventory/api/partDetails";
import { getWarehouses, getActiveWarehouses, Warehouse } from "@/features/inventory/api/inventory";
import { useWarehouses } from "@/features/inventory/hooks/useWarehouses";
import { EditPartModal } from "@/features/inventory/components/EditPartModal";
import { CommentTimeline } from "@/features/inventory/components/CommentTimeline";
import { DocumentGrid } from "@/features/inventory/components/DocumentGrid";
import { deletePartDocument } from "@/features/inventory/api/partDetails";

export default function InventoryPartDetailsPage() {
  const t = useTranslations("inventory.details");
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  // State
  const [newComment, setNewComment] = useState("");
  const { isOpen, open, close } = useModal();
  const {
    isOpen: isStockModalOpen,
    open: openStockModal,
    close: closeStockModal,
  } = useModal();

  const {
    isOpen: isUploadModalOpen,
    open: openUploadModal,
    close: closeUploadModal,
  } = useModal();

  // Queries
  const { data: part, isLoading: isPartLoading, error: partError, refetch: refetchPart } = useQuery({
    queryKey: ["part", id],
    queryFn: () => getPart(id),
  });

  const { data: stockLevels, isLoading: isStockLoading, refetch: refetchStock } = useQuery({
    queryKey: ["part-stock", id],
    queryFn: () => getPartStock(id),
    enabled: !!part,
  });

  const { data: movements, isLoading: isMovementsLoading, refetch: refetchMovements } = useQuery({
    queryKey: ["part-movements", id],
    queryFn: () => getStockMovements({ part_id: id }),
    enabled: !!part,
  });

  const { data: documents, isLoading: isDocumentsLoading, refetch: refetchDocuments } = useQuery({
    queryKey: ["part-documents", id],
    queryFn: () => getPartDocuments(id),
    enabled: !!part,
  });

  const { data: comments, isLoading: isCommentsLoading, refetch: refetchComments } = useQuery({
    queryKey: ["part-comments", id],
    queryFn: () => getPartComments(id),
    enabled: !!part,
  });

  const { data: warehouses } = useWarehouses(true);

  // Mutations
  const addCommentMutation = useMutation({
    mutationFn: (text: string) => addPartComment(id, text),
    onSuccess: () => {
      setNewComment("");
      toast.success(t("comments.toasts.success"));
      refetchComments();
    },
    onError: () => {
      toast.error(t("comments.toasts.error"));
    }
  });

  const documentMutation = useMutation({
    mutationFn: (file: File) => {
        const mockUrl = URL.createObjectURL(file);
        return addPartDocument(id, {
            name: file.name,
            file_url: mockUrl,
            file_size: file.size,
            media_type: file.type
        });
    },
    onSuccess: () => {
        refetchDocuments();
        toast.success(t("attachments.toasts.added"));
        closeUploadModal(); // Close the modal if used
    },
    onError: () => {
        toast.error(t("attachments.toasts.error"));
    }
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: (documentId: string) => deletePartDocument(id, documentId),
    onSuccess: () => {
      refetchDocuments();
      toast.success(t("attachments.toasts.deleted"));
    },
    onError: () => {
      toast.error(t("attachments.toasts.deleteError"));
    }
  });

  const stockAdjustmentMutation = useMutation({
    mutationFn: (data: CreateStockMovementRequest) => adjustPartStock({ ...data, part_id: id }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["part-stock", id] });
        queryClient.invalidateQueries({ queryKey: ["part", id] }); // Total quantity might change
        queryClient.invalidateQueries({ queryKey: ["part-movements", id] });
        toast.success(t("toasts.stockAdjusted"));
    },
    onError: (err: any) => {
        toast.error(err.response?.data?.error || t("toasts.stockAdjustError"));
    }
  });

  const updatePartMutation = useMutation({
    mutationFn: (data: Partial<Part>) => updatePart(id, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["part", id] });
      toast.success(t("toasts.partUpdated"));
      close();
    },
    onError: () => {
      toast.error(t("toasts.partUpdateError"));
    },
  });

  const handleEditSave = (data: Partial<Part>) => {
    updatePartMutation.mutate(data);
  };



  if (isPartLoading) {
    return <DetailPageSkeleton />;
  }

  if (partError || !part) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("error.title")}</AlertTitle>
        <AlertDescription>{t("error.description")}</AlertDescription>
      </Alert>
    );
  }

  // --- Helpers ---
  const handleFileUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    documentMutation.mutate(file);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment.trim());
  };

  const handleStockAdjustment = (
    adjustment: CreateStockMovementRequest
  ) => {
    stockAdjustmentMutation.mutate(adjustment);
  };

  const currentTotalStock = stockLevels?.reduce((acc, s) => acc + s.quantity, 0) || part.total_quantity || 0;
  const totalValue = currentTotalStock * (part.unit_price || 0);

  // Status Logic
  const minQty = part.min_quantity || 0;
  const isCritical = currentTotalStock === 0;
  const isLow = currentTotalStock <= minQty;
  const getStatusColor = () => {
      if (isCritical) return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800";
      if (isLow) return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
  };
  const statusLabel = isCritical ? t("status.critical") : isLow ? t("status.low") : t("status.inStock");
  const statusIcon = isCritical ? AlertCircle : isLow ? AlertTriangle : CheckCircle2;
  const StatusIcon = statusIcon;


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Badge variant="outline" className={`px-3 py-1 text-sm font-medium border ${getStatusColor()} flex items-center gap-2`}>
                   <StatusIcon className="h-3.5 w-3.5" />
                   {statusLabel}
                </Badge>
                <span className="text-sm text-muted-foreground">{t("updatedToday")}</span>
            </div>

            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {part.name}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-foreground">{part.brand || t("unknownBrand")}</span>
                    <span>•</span>
                    <span className="font-mono">{t("sku")} {part.part_number}</span>
                    <span>•</span>
                    <Badge variant="secondary" className="rounded-md px-2 font-normal capitalize">
                        {part.category?.name || t("generalCategory")}
                    </Badge>
                </div>
            </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={openStockModal} className="h-10">
            <TrendingUp className="mr-2 h-4 w-4" /> {t("adjustStock")}
          </Button>
          <Button variant="outline" onClick={open} className="h-10">
            <Pencil className="mr-2 h-4 w-4" /> {t("editPart")}
          </Button>
          <Button className="h-10">
            <Archive className="mr-2 h-4 w-4" /> {t("exportCSV")}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="overview" className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
             {t("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="stock" className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
             {t("tabs.stock")}
          </TabsTrigger>
          <TabsTrigger value="movements" className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
             {t("tabs.movements")}
          </TabsTrigger>
          <TabsTrigger value="attachments" className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
             {t("tabs.attachments")}
          </TabsTrigger>
          <TabsTrigger value="comments" className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">
             {t("tabs.comments")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-300">
           {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PremiumMetricCard
                title={t("overview.onHand.title")}
                value={t("overview.onHand.units", { count: currentTotalStock })}
                icon={Boxes}
                variant={isCritical ? "rose" : isLow ? "orange" : "blue"}
                subtitle={isLow 
                  ? t("overview.onHand.belowTarget", { count: minQty - currentTotalStock })
                  : t("overview.onHand.healthy")
                }
            />
            <PremiumMetricCard
                title={t("overview.reorderPoint.title")}
                value={t("overview.reorderPoint.units", { count: minQty })}
                icon={AlertTriangle}
                variant="slate"
                subtitle={t("overview.reorderPoint.description")}
            />
            <PremiumMetricCard
                title={t("overview.unitPrice.title")}
                value={formatCurrency(part.unit_price || 0)}
                icon={Tag}
                variant="teal"
                subtitle={t("overview.unitPrice.description")}
            />
            <PremiumMetricCard
                title={t("overview.totalValue.title")}
                value={formatCurrency(totalValue)}
                icon={Coins}
                variant="green"
                subtitle={t("overview.totalValue.description")}
            />
          </div>

          <Card>
              <CardHeader>
                  <CardTitle>{t("overview.description.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {part.description || t("overview.description.empty")}
                  </p>
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4 animate-in fade-in duration-300">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("stock.title")}</CardTitle>
              <Button variant="outline" size="sm" onClick={openStockModal}>
                  <TrendingUp className="mr-2 h-4 w-4" /> {t("transferStock")}
              </Button>
            </CardHeader>
            <CardContent>
              {isStockLoading ? ( <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div> ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">{t("stock.location")}</TableHead>
                    <TableHead>{t("stock.stock")}</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockLevels?.map((stock) => {
                    const percentage = Math.min((stock.quantity / Math.max(currentTotalStock, 1)) * 100, 100);

                    return (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                                <Boxes className="h-4 w-4 text-gray-500" />
                            </div>
                            {stock.warehouse?.name || t("stock.unknownWarehouse")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2 max-w-[200px]">
                           <div className="flex justify-between text-xs text-muted-foreground">
                                <span className={stock.quantity <= part.min_quantity ? "text-orange-500 font-medium" : ""}>
                                    {t("overview.onHand.units", { count: stock.quantity })}
                                </span>
                                <span>{percentage.toFixed(0)}% {t("ofTotal")}</span>
                           </div>
                           <Progress value={percentage} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                         <Button variant="ghost" size="sm">{t("manage")}</Button>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                  {(!stockLevels || stockLevels.length === 0) && (
                      <TableRow><TableCell colSpan={3} className="text-center text-gray-500 py-8">{t("stock.empty")}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4 animate-in fade-in duration-300">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("movements.title")}</CardTitle>
              <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">{t("filter")}</Button>
                  <Button variant="outline" size="sm" className="h-8">{t("dateRange")}</Button>
              </div>
            </CardHeader>
            <CardContent>
            {isMovementsLoading ? ( <div className="p-4 flex justify-center"><Loader2 className="animate-spin" /></div> ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("movements.date")}</TableHead>
                    <TableHead>{t("movements.type")}</TableHead>
                    <TableHead>{t("movements.quantity")}</TableHead>
                    <TableHead>{t("movements.location")}</TableHead>
                    <TableHead>{t("movements.id")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements?.map((move) => (
                    <TableRow key={move.id}>
                       <TableCell className="font-medium text-muted-foreground">
                          {format(new Date(move.created_at), "MMM d, yyyy HH:mm")}
                       </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                              move.movement_type === "PURCHASE" || move.movement_type === "ADJUSTMENT"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100"
                              : move.movement_type === "CONSUMPTION" || move.movement_type === "SCRAP"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          }
                        >
                          {t(`movements.types.${move.movement_type.toUpperCase()}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                          <span className={move.movement_type === "PURCHASE" || move.movement_type === "ADJUSTMENT" ? "text-emerald-600 font-medium" : "text-gray-900 dark:text-gray-100"}>
                            {move.movement_type === "PURCHASE" || move.movement_type === "ADJUSTMENT" ? "+" : ""}{move.quantity}
                          </span>
                      </TableCell>
                      <TableCell>{move.warehouse?.name || "-"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{move.id.substring(0, 8)}</TableCell>
                    </TableRow>
                  ))}
                   {(!movements || movements.length === 0) && (
                      <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">{t("movements.empty")}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
             )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4 animate-in fade-in duration-300">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("attachments.title")}</CardTitle>
              <div>
                <Input
                  id="part-files"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={documentMutation.isPending}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("part-files")?.click()}
                  disabled={documentMutation.isPending}
                >
                    {documentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                   {t("upload")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isDocumentsLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
              ) : (
                  <DocumentGrid 
                    documents={documents || []} 
                    onDelete={(id) => deleteDocumentMutation.mutate(id)} 
                  />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4 animate-in fade-in duration-300">
          <Card>
            <CardHeader>
              <CardTitle>{t("comments.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Textarea
                  placeholder={t("comments.placeholder")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={addCommentMutation.isPending}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={addCommentMutation.isPending || !newComment.trim()}>
                      {addCommentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t("comments.post")}
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                {isCommentsLoading ? (
                    <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
                ) : (
                    <CommentTimeline comments={comments || []} />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {part && <EditPartModal
        isOpen={isOpen}
        onClose={close}
        part={part}
        onSave={handleEditSave}
        isSaving={updatePartMutation.isPending}
      />}

      {part && <StockAdjustmentModal
        isOpen={isStockModalOpen}
        onClose={closeStockModal}
        partName={part.name}
        globalStock={currentTotalStock} // Renamed prop
        warehouses={warehouses}
        stocks={stockLevels} // New prop
        onSave={handleStockAdjustment}
      />}
    </div>
  );
}
