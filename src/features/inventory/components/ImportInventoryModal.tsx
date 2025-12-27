"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  FileUp, 
  Download, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileIcon
} from "lucide-react";
import { useTranslations } from "next-intl";
import { 
  getInventoryImportTemplate, 
  importInventoryExcel, 
  ImportResult 
} from "../api/inventoryExcel";
import { useQueryClient } from "@tanstack/react-query";

interface ImportInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportInventoryModal({ isOpen, onClose }: ImportInventoryModalProps) {
  const t = useTranslations("inventory.excel");
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".xlsx")) {
        toast.error(t("onlyXlsx"));
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error(t("noFile"));
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const data = await importInventoryExcel(file);
      setResult(data);
      
      if (data.failed_count === 0) {
        toast.success(t("success"));
        queryClient.invalidateQueries({ queryKey: ["parts"] });
      } else if (data.success_count > 0) {
        toast.warning(`${data.success_count} success, ${data.failed_count} failed`);
        queryClient.invalidateQueries({ queryKey: ["parts"] });
      } else {
        toast.error(t("failedCount", { count: data.failed_count }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Import failed");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await getInventoryImportTemplate();
    } catch (error) {
      toast.error("Failed to download template");
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setIsImporting(false);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" />
            {t("importTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("importDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!result ? (
            <>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors ${
                  file ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileIcon className="h-12 w-12 text-primary mb-3" />
                    <p className="font-medium text-sm text-center max-w-[200px] truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setFile(null)}
                      disabled={isImporting}
                    >
                      {t("close")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <FileUp className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <div className="text-center">
                      <Label htmlFor="inventory-file-upload" className="cursor-pointer">
                        <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                          {t("selectFile")}
                        </span>
                        <input 
                          id="inventory-file-upload" 
                          type="file" 
                          className="hidden" 
                          accept=".xlsx"
                          onChange={handleFileChange}
                          disabled={isImporting}
                        />
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">{t("onlyXlsx")}</p>
                  </>
                )}
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{t("templateInfo")}</p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-amber-700 dark:text-amber-400 font-semibold"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {t("downloadTemplate")}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border">
                <div className={`p-2 rounded-full ${result.failed_count === 0 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                  {result.failed_count === 0 ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{t("success")}</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-green-600 font-semibold">{t("importedCount", { count: result.success_count })}</span>
                    {result.failed_count > 0 && (
                      <> • <span className="text-destructive font-semibold">{t("failedCount", { count: result.failed_count })}</span></>
                    )}
                  </p>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-bold flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    {t("errors")}
                  </h5>
                  <div className="max-h-[200px] overflow-y-auto rounded-md border text-xs divide-y">
                    {result.errors.map((err, i) => (
                      <div key={i} className="p-2 flex justify-between bg-destructive/5">
                        <span className="font-medium">Row {err.row}</span>
                        <span className="text-destructive">{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!result ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isImporting}>
                {t("close")}
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!file || isImporting}
                className="min-w-[120px]"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("importing")}
                  </>
                ) : (
                  t("import")
                )}
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={handleCancel}>
              {t("close")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
