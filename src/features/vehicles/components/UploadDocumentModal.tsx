"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AddVehicleDocumentRequest } from "@/features/vehicles/api/vehicleDocuments";
import { useTranslations } from "next-intl";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddVehicleDocumentRequest) => void;
  isSubmitting?: boolean;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: UploadDocumentModalProps) {
  const t = useTranslations("vehicles.details.documents");
  const tForm = useTranslations("vehicles.details.form");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddVehicleDocumentRequest>();

  const handleFormSubmit = (payload: AddVehicleDocumentRequest) => {
    onSubmit(payload);
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("modalTitle")}
      description={t("modalDesc")}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label={t("name")}
          placeholder="Insurance Card 2024"
          {...register("name", { required: "Document name is required" })}
          error={errors.name?.message}
        />

        <Input
          label={t("fileName")}
          placeholder="insurance_card.pdf"
          {...register("file_name", { required: "File name is required" })}
          error={errors.file_name?.message}
        />

        <Input
          label={t("type")}
          placeholder="insurance"
          {...register("document_type", { required: "Type is required" })}
          error={errors.document_type?.message}
        />

        <Input
          label={t("fileUrl")}
          type="url"
          placeholder="https://example.com/document.pdf"
          {...register("file_url", {
            required: "A file URL is required",
            pattern: {
              value: /^(https?:\/\/).+/,
              message: "Provide a valid URL",
            },
          })}
          error={errors.file_url?.message}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {tForm("cancel")}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t("upload")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
