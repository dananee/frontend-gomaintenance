"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AddVehicleDocumentRequest } from "@/features/vehicles/api/vehicleDocuments";

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
      title="Upload Document"
      description="Attach insurance cards, registrations, and inspection reports to this vehicle"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Document Name"
          placeholder="Insurance Card"
          {...register("name", { required: "Document name is required" })}
          error={errors.name?.message}
        />

        <Input
          label="Type"
          placeholder="insurance"
          {...register("type", { required: "Type is required" })}
          error={errors.type?.message}
        />

        <Input
          label="File URL"
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
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Upload
          </Button>
        </div>
      </form>
    </Modal>
  );
}
