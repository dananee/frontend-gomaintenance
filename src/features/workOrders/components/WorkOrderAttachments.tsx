"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  X,
  Download,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef } from "react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy?: string;
  url?: string;
}

interface WorkOrderAttachmentsProps {
  workOrderId: string;
  attachments?: Attachment[];
}

export function WorkOrderAttachments({
  workOrderId,
  attachments = [],
}: WorkOrderAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localAttachments, setLocalAttachments] = useState<Attachment[]>(
    attachments.length > 0
      ? attachments
      : [
          {
            id: "1",
            name: "before_repair.jpg",
            type: "image/jpeg",
            size: "2.4 MB",
            uploadedAt: "2024-11-25T10:30:00Z",
            uploadedBy: "Tech John",
          },
          {
            id: "2",
            name: "damage_report.pdf",
            type: "application/pdf",
            size: "856 KB",
            uploadedAt: "2024-11-25T09:15:00Z",
            uploadedBy: "Tech John",
          },
        ]
  );

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: String(Date.now() + Math.random()),
      name: file.name,
      type: file.type,
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User",
      work_order_id: workOrderId,
    }));

    setLocalAttachments([...localAttachments, ...newAttachments]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDelete = (attachmentId: string) => {
    setLocalAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-10 w-10 text-blue-500" />;
    }
    return <FileText className="h-10 w-10 text-gray-500" />;
  };

  const getFileTypeBadge = (type: string) => {
    if (type.startsWith("image/")) return "Image";
    if (type === "application/pdf") return "PDF";
    if (type.includes("word")) return "Word";
    if (type.includes("excel") || type.includes("spreadsheet")) return "Excel";
    return "File";
  };

  return (
    <div className="space-y-4">
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Attachments & Files</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Upload photos, invoices, and documentation
              </p>
            </div>
            <Button onClick={handleUpload} size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {localAttachments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                No attachments yet
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Drag and drop files here or click the button above
              </p>
              <Button
                onClick={handleUpload}
                variant="outline"
                className="mt-4"
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {localAttachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="group rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(attachment.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {attachment.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {attachment.size}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {getFileTypeBadge(attachment.type)}
                        </span>
                      </div>
                      {attachment.uploadedBy && (
                        <p className="text-xs text-gray-400 mt-1">
                          By {attachment.uploadedBy}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          console.log("Download:", attachment.name)
                        }
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(attachment.id)}
                        title="Delete"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
