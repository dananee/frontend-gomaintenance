"use client";

import { formatDateShort } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Trash2, Upload, File, Image as ImageIcon, FileSpreadsheet, Eye, MoreVertical, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { VehicleDocument } from "@/features/vehicles/api/vehicleDocuments";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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
  const t = useTranslations("features.vehicles.documents");

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="h-8 w-8 text-purple-600" />;
    if (type.includes("sheet") || type.includes("csv")) return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
    if (type.includes("pdf")) return <FileText className="h-8 w-8 text-red-600" />;
    return <File className="h-8 w-8 text-blue-600" />;
  };

  const getStatusBadge = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <Badge variant="destructive" className="gap-1 pl-1 pr-2">
          <AlertTriangle className="h-3 w-3" /> {t("expired")}
        </Badge>
      );
    }
    if (diffDays <= 30) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 gap-1 pl-1 pr-2">
           <AlertTriangle className="h-3 w-3" /> {t("expiringSoon")}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400 gap-1 pl-1 pr-2">
        <CheckCircle className="h-3 w-3" /> {t("valid")}
      </Badge>
    );
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
          <h2 className="text-lg font-semibold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button onClick={onUpload} size="sm">
          <Upload className="mr-2 h-4 w-4" />
          {t("upload")}
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card className="border-dashed border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <File className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t("noDocs")}</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              {t("noDocsDesc")}
            </p>
            <Button onClick={onUpload} variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
              {t("upload")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="group relative overflow-hidden transition-all hover:shadow-md border-gray-200 dark:border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-900/50">
                     {getFileIcon(doc.document_type || "file")}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(doc.file_url, "_blank")}>
                        <Eye className="mr-2 h-4 w-4" /> {t("view")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(doc.file_url, "_blank")}>
                        <Download className="mr-2 h-4 w-4" /> {t("download")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(doc.id)} className="text-red-600 focus:text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={doc.name}>
                    {doc.name || t("untitled")}
                  </h3>
                  <p className="text-xs text-muted-foreground capitalize">
                     {doc.document_type?.replace(/_/g, " ") || "Document"} • {formatFileSize(doc.file_size)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 border-t pt-3 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{doc.expiry_date ? formatDateShort(doc.expiry_date) : "No Expiry"}</span>
                  </div>
                   {getStatusBadge(doc.expiry_date)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
