"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  File,
  FileSpreadsheet,
  Trash2,
  Cloud,
  Eye,
} from "lucide-react";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listWorkOrderAttachments,
  addWorkOrderAttachment,
  deleteWorkOrderAttachment
} from "../api/workOrderAttachments";
import { uploadFile } from "@/features/vehicles/api/vehicleDocuments";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

interface WorkOrderAttachmentsProps {
  workOrderId: string;
}

export function WorkOrderAttachments({ workOrderId }: WorkOrderAttachmentsProps) {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ["workOrderAttachments", workOrderId],
    queryFn: () => listWorkOrderAttachments(workOrderId),
    enabled: !!workOrderId,
  });

  const getFullUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const baseUrl = apiUrl.replace("/api/v1", "");
    return `${baseUrl}${url}`;
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const fullUrl = getFullUrl(url);
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(getFullUrl(url), "_blank");
    }
  };

  const handleView = (url: string) => {
    window.open(getFullUrl(url), "_blank");
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // 1. Upload to permanent storage first
      const uploadedRaw = await uploadFile(file);

      // 2. Save metadata with permanent URL
      return addWorkOrderAttachment(workOrderId, {
        file_url: uploadedRaw.url,
        file_name: file.name,
        file_type: file.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderAttachments", workOrderId] });
      toast.success(tt("success.fileUploaded"));
    },
    onError: () => {
      toast.error(tt("error.uploadFailed"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) => deleteWorkOrderAttachment(workOrderId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderAttachments", workOrderId] });
      toast.success(tt("success.fileDeleted"));
    },
    onError: () => {
      toast.error(tt("error.deleteFileFailed"));
    },
  });

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => uploadMutation.mutate(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => uploadMutation.mutate(file));
  };

  const handleDelete = (attachmentId: string) => {
    if (confirm(tc("confirmDelete", { item: t("attachments.item") }))) {
      deleteMutation.mutate(attachmentId);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (ext === 'pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <File className="h-8 w-8 text-gray-400" />;
  };

  const formatSafeDate = (dateString: string) => {
    try {
      return formatDateShort(dateString);
    } catch (e) {
      return t("card.noDate");
    }
  };

  return (
    <div className="space-y-6">
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />

      <Card className="border-none shadow-sm bg-white dark:bg-gray-950">
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t("attachments.title")}
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t("attachments.subtitle")}
              </p>
            </div>
            <Button
              onClick={handleUpload}
              variant="outline"
              className="shadow-sm"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {t("attachments.upload")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUpload}
            className={`
              relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer
              ${isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-800 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900/50"
              }
            `}
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-3">
              <Cloud className={`h-6 w-6 text-blue-600 dark:text-blue-400 ${isDragging ? "animate-bounce" : ""}`} />
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t("attachments.dropzone.title")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("attachments.dropzone.subtitle")}
            </p>
          </div>

          {/* Attachments Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : attachments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t("attachments.empty")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {attachments.map((attachment) => (
                  <motion.div
                    key={attachment.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {getFileIcon(attachment.file_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate" title={attachment.file_name}>
                          {attachment.file_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatSafeDate(attachment.uploaded_at)}
                        </p>
                      </div>
                    </div>

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2 backdrop-blur-[1px]">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/30"
                        title={tc("view")}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(attachment.file_url);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/30"
                        title={tc("download")}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(attachment.file_url, attachment.file_name);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(attachment.id);
                        }}
                        title={tc("delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
