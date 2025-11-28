"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Download, Image as ImageIcon } from "lucide-react";

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
  const mockAttachments: Attachment[] = attachments.length > 0 ? attachments : [
    {
      id: "1",
      name: "before_repair.jpg",
      type: "image",
      size: "2.4 MB",
      uploadedAt: "2024-11-25T10:30:00Z",
      uploadedBy: "Tech John",
    },
    {
      id: "2",
      name: "damage_report.pdf",
      type: "pdf",
      size: "856 KB",
      uploadedAt: "2024-11-25T09:15:00Z",
      uploadedBy: "Tech John",
    },
  ];

  const handleUpload = () => {
    // TODO: Implement file upload
    console.log("Upload clicked for work order:", workOrderId);
  };

  const handleDelete = (attachment: Attachment) => {
    // TODO: Implement file delete
    console.log("Delete:", attachment.name);
  };

  const handleDownload = (attachment: Attachment) => {
    // TODO: Implement file download
    console.log("Download:", attachment.name);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Attachments & Photos
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload photos, invoices, and documentation
          </p>
        </div>
        <Button onClick={handleUpload} size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {mockAttachments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No attachments yet
            </p>
            <p className="mt-2 text-xs text-gray-400 text-center">
              Drag and drop files here or click the button above
            </p>
            <Button onClick={handleUpload} variant="outline" className="mt-4" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {mockAttachments.map((attachment) => (
            <Card key={attachment.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {attachment.type === "image" ? (
                      <ImageIcon className="h-10 w-10 text-blue-500" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {attachment.size}
                    </p>
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
                      className="h-8 w-8"
                      onClick={() => handleDownload(attachment)}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(attachment)}
                      title="Delete"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
