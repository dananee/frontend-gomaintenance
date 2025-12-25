"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  FileUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ImportResult, ImportError } from "../types/import";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VehicleImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (file: File) => Promise<ImportResult>;
  onDownloadTemplate: () => Promise<void>;
}

export function VehicleImportModal({
  open,
  onOpenChange,
  onImport,
  onDownloadTemplate,
}: VehicleImportModalProps) {
  const t = useTranslations("features.vehicles.import");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".xlsx")) {
        setSelectedFile(file);
        setImportResult(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      const result = await onImport(selectedFile);
      setImportResult(result);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    setIsImporting(false);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {!importResult ? (
            <div className="space-y-4">
              {/* Template Download */}
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{t("templateInfo")}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDownloadTemplate}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t("downloadTemplate")}
                  </Button>
                </AlertDescription>
              </Alert>

              {/* File Upload Area */}
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700",
                  selectedFile && "border-green-500 bg-green-50 dark:bg-green-900/20"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <FileSpreadsheet className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t("removeFile")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <FileUp className="mb-4 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 font-medium">
                      {t("dragDrop")}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("onlyXlsxCsv")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {t("browse")}
                    </Button>
                  </>
                )}
              </div>

              {/* Import Progress */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("importing")}</span>
                    <span className="font-semibold">Processing...</span>
                  </div>
                  <Progress value={undefined} className="h-2" />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Import Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Alert className="border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription>
                    <div className="font-semibold text-green-900 dark:text-green-100">
                      {importResult.success_count} {t("successful")}
                    </div>
                    <div className="text-xs text-green-700 dark:text-green-300">
                      {t("vehiclesImported")}
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20">
                  <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription>
                    <div className="font-semibold text-red-900 dark:text-red-100">
                      {importResult.failed_count} {t("failed")}
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300">
                      {t("vehiclesFailed")}
                    </div>
                  </AlertDescription>
                </Alert>
              </div>

              {/* Error Details */}
              {importResult.errors?.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    {t("errorDetails")}
                  </div>
                  <ScrollArea className="h-[300px] rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">{t("row")}</TableHead>
                          <TableHead className="w-[120px]">{t("field")}</TableHead>
                          <TableHead>{t("error")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importResult.errors.map((error, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {error.row}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {error.field || "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {error.message}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!importResult ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isImporting}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? t("importing") : t("import")}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
