
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AddVehicleDocumentRequest } from "@/features/vehicles/api/vehicleDocuments";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { FileText, X, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddVehicleDocumentRequest) => void;
  isSubmitting?: boolean;
}

type Step = "upload" | "details";

export function UploadDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: UploadDocumentModalProps) {
  const t = useTranslations("features.vehicles.documents");
  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddVehicleDocumentRequest>();

  const handleClose = () => {
    reset();
    setStep("upload");
    setSelectedFile(null);
    onClose();
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    // Auto-fill metadata
    const fileName = file.name;
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    
    setValue("file_name", fileName);
    setValue("name", nameWithoutExt.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())); // Title Case
    
    // Attempt auto-classify type
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes("invoice") || lowerName.includes("bill")) setValue("document_type", "invoice");
    else if (lowerName.includes("insurance")) setValue("document_type", "insurance");
    else if (lowerName.includes("inspection")) setValue("document_type", "inspection");
    else if (lowerName.includes("registration")) setValue("document_type", "registration");
    else setValue("document_type", "other");

    // Mock URL for now (in real app, this would be S3 upload response)
    setValue("file_url", URL.createObjectURL(file));

    setStep("details");
  };

  const handleFormSubmit = (payload: AddVehicleDocumentRequest) => {
    onSubmit(payload);
    // Reset handled by parent or on success usually, but we do it here for now
    setTimeout(() => {
        if (!isSubmitting) handleClose();
    }, 100);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("modalTitle")}
      description={t("modalDesc")}
      // className="sm:max-w-lg" // Modal component might need support for className prop
    >
      <div className="mt-4">
        {step === "upload" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <FileUploader 
               onFileSelect={handleFileSelect}
               accept=".pdf,.jpg,.jpeg,.png,.docx"
             />
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            {/* File Preview Card */}
            {selectedFile && (
              <Card className="p-4 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => {
                        setSelectedFile(null);
                        setStep("upload");
                    }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            )}

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">{t("name")}</Label>
                    <Input
                        id="name"
                        {...register("name", { required: true })}
                        placeholder="e.g. Annual Inspection Report"
                    />
                    {errors.name && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="type">{t("type")}</Label>
                     <Select 
                        onValueChange={(val) => setValue("document_type", val)} 
                        defaultValue="other"
                     >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="insurance">{t("types.insurance")}</SelectItem>
                        <SelectItem value="registration">{t("types.registration")}</SelectItem>
                        <SelectItem value="inspection">{t("types.inspection")}</SelectItem>
                        <SelectItem value="invoice">{t("types.invoice")}</SelectItem>
                        <SelectItem value="other">{t("types.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="expiry_date">{t("expiryDate")}</Label>
                    <Input
                        id="expiry_date"
                        type="date"
                        {...register("expiry_date")}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Hidden inputs for API compatibility */}
            <input type="hidden" {...register("file_name")} />
            <input type="hidden" {...register("file_url")} />
            <input type="hidden" {...register("document_type")} />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="min-w-[120px]">
                {t("confirmUpload")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
