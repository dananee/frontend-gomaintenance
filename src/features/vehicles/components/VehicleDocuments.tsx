"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Trash2, Upload, File, Image as ImageIcon, FileSpreadsheet } from "lucide-react";
import { VehicleDocument } from "@/features/vehicles/api/vehicleDocuments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VehicleDocumentsProps {
  documents: VehicleDocument[];
  onUpload: () => void;
  onDelete: (docId: string) => void;
  isDeleting?: boolean;
}

export function VehicleDocuments({
  documents,
  onUpload,
  onDelete,
  isDeleting,
}: VehicleDocumentsProps) {
  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="h-5 w-5 text-purple-600" />;
    if (type.includes("sheet") || type.includes("csv")) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-600" />;
    return <File className="h-5 w-5 text-blue-600" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Vehicle Documents</h2>
          <p className="text-sm text-muted-foreground">
            Manage insurance, registration, and inspection records
          </p>
        </div>
        <Button onClick={onUpload} size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card className="border-dashed border-gray-300 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/20">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Documents Uploaded</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Keep all your vehicle records in one place. Upload insurance policies,
              registration cards, and inspection reports.
            </p>
            <Button onClick={onUpload} variant="outline" className="border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[40%]">Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className="group transition-colors hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-background">
                        {getFileIcon(doc.document_type || "file")}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {doc.file_name || doc.name || "Untitled Document"}
                        </span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize text-muted-foreground">
                      {doc.document_type?.replace(/_/g, " ") || "Document"}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(doc.file_size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                        onClick={() => window.open(doc.file_url, "_blank")}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                        onClick={() => onDelete(doc.id)}
                        disabled={isDeleting}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
