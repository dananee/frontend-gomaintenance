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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDateShort } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";

interface WorkOrderAttachmentsProps {
  workOrderId: string;
}

export function WorkOrderAttachments({ workOrderId }: WorkOrderAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isDragging, setIsDragging] = useState(false);

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ["workOrderAttachments", workOrderId],
    queryFn: () => listWorkOrderAttachments(workOrderId),
    enabled: !!workOrderId,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fakeUrl = URL.createObjectURL(file);
      return addWorkOrderAttachment(workOrderId, {
        file_url: fakeUrl,
        file_name: file.name,
        file_type: file.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderAttachments", workOrderId] });
      toast.success("File uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (attachmentId: string) => deleteWorkOrderAttachment(workOrderId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderAttachments", workOrderId] });
      toast.success("File deleted");
    },
    onError: () => {
      toast.error("Failed to delete file");
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
    if (confirm("Delete this attachment?")) {
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
      return "Unknown date";
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
                Attachments & Files
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Manage photos, documents, and invoices
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
              Upload Files
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
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              SVG, PNG, JPG or GIF (max. 10MB)
            </p>
          </div>

          {/* Attachments Grid */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : attachments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">No attachments yet</p>
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
                      <a
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/30")}
                        title="View"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                      <a
                        href={attachment.file_url}
                        download={attachment.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8 text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/30")}
                        title="Download"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(attachment.id);
                        }}
                        title="Delete"
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
