
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AddVehicleDocumentRequest } from "@/features/vehicles/api/vehicleDocuments";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { uploadFile } from "@/features/vehicles/api/vehicleDocuments";
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

import { useFormGuard } from "@/hooks/useFormGuard";

// ... existing code ...

export function UploadDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: UploadDocumentModalProps) {
  const t = useTranslations("features.vehicles.documents");
  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddVehicleDocumentRequest>();

  // Reset modal state when it opens
  useEffect(() => {
    if (isOpen) {
      reset();
      setStep("upload");
      setSelectedFile(null);
      setIsUploading(false);
    }
  }, [isOpen, reset]);

  const { preventClose, handleAttemptClose } = useFormGuard({
    isDirty: isDirty || step === "details", // Guard if form is dirty or if we are in details step
    onClose: () => {
      reset();
      setStep("upload");
      setSelectedFile(null);
      onClose();
    },
  });

  const handleClose = handleAttemptClose;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    // Auto-fill metadata
    const fileName = file.name;
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

    setValue("file_name", fileName);
    setValue("name", nameWithoutExt.split("_").join(" ").replace(/\b\w/g, l => l.toUpperCase())); // Title Case
    setValue("file_size", file.size);

    // Attempt auto-classify type
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes("invoice") || lowerName.includes("bill")) setValue("document_type", "invoice");
    else if (lowerName.includes("insurance")) setValue("document_type", "insurance");
    else if (lowerName.includes("inspection")) setValue("document_type", "inspection");
    else if (lowerName.includes("registration")) setValue("document_type", "registration");
    else setValue("document_type", "other");

    setStep("details");
  };

  const handleFormSubmit = async (payload: AddVehicleDocumentRequest) => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      // 1. Upload the physical file first to get the permanent URL
      const { url } = await uploadFile(selectedFile);

      // 2. Submit metadata with the permanent URL
      onSubmit({
        ...payload,
        file_url: url,
      });

      // Close will be handled by success in parent (page.tsx)
    } catch (error) {
      console.error("Upload failed:", error);
      // Error handling is usually done via toast in parent, 
      // but we need to reset loading state here if we don't close
      setIsUploading(false);
    }
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
      preventClose={preventClose}
      onAttemptClose={handleAttemptClose}
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
                    <SelectItem value="vignette">{t("types.vignette")}</SelectItem>
                    <SelectItem value="registration_certificate">{t("types.registration_certificate")}</SelectItem>
                    <SelectItem value="vehicle_registration_document">{t("types.vehicle_registration_document")}</SelectItem>
                    <SelectItem value="regulatory_inspection">{t("types.regulatory_inspection")}</SelectItem>
                    <SelectItem value="tachygraphe">{t("types.tachygraphe")}</SelectItem>
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
              <Button type="submit" isLoading={isSubmitting || isUploading} className="min-w-[120px]">
                {t("confirmUpload")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
