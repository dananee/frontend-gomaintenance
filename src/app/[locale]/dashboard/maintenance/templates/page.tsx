"use client";

import { useState } from "react";
import { TemplateTable } from "@/features/maintenance/components/TemplateTable";
import { TemplateForm } from "@/features/maintenance/components/TemplateForm";
import {
  useMaintenanceTemplates,
  useCreateMaintenanceTemplate,
  useUpdateMaintenanceTemplate,
  useDeleteMaintenanceTemplate,
} from "@/features/maintenance/hooks/useMaintenanceTemplates";
import { MaintenanceTemplate } from "@/features/maintenance/types/maintenanceTemplate.types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MaintenanceTemplatesPageProps {
  params: {
    locale: string;
  };
}

export default function MaintenanceTemplatesPage({ params }: MaintenanceTemplatesPageProps) {
  const { locale } = params;
  const { data, isLoading } = useMaintenanceTemplates();
  const { isOpen, open, close } = useModal();
  const [selectedTemplate, setSelectedTemplate] =
    useState<MaintenanceTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createMutation = useCreateMaintenanceTemplate();
  const updateMutation = useUpdateMaintenanceTemplate();
  const deleteMutation = useDeleteMaintenanceTemplate();

  const handleCreate = () => {
    setSelectedTemplate(null);
    open();
  };

  const handleEdit = (template: MaintenanceTemplate) => {
    setSelectedTemplate(template);
    open();
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedTemplate) {
        await updateMutation.mutateAsync({
          id: selectedTemplate.id,
          data: formData,
        });
        toast.success("Template updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Template created successfully");
      }
      close();
    } catch (error) {
      toast.error("Failed to save template");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Template deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/dashboard/maintenance`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Maintenance Templates
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Create and manage preventive maintenance templates
            </p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <TemplateTable
        templates={data?.data || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      <Modal
        isOpen={isOpen}
        onClose={close}
        title={selectedTemplate ? "Edit Template" : "Create Template"}
      >
        <TemplateForm
          initialData={selectedTemplate || undefined}
          onSubmit={handleSubmit}
          onCancel={close}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}