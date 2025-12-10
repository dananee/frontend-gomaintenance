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
import { useTranslations } from "next-intl";

export default function MaintenanceTemplatesPage() {
  const t = useTranslations("maintenance.templates");
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
        toast.success(t("toasts.updateSuccess"));
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(t("toasts.createSuccess"));
      }
      close();
    } catch (error) {
      toast.error(t("toasts.saveError"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success(t("toasts.deleteSuccess"));
      setDeleteId(null);
    } catch (error) {
      toast.error(t("toasts.deleteSuccess"));
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/maintenance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t("actions.create")}
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
        title={selectedTemplate ? t("modals.edit") : t("modals.create")}
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
            <AlertDialogTitle>{t("alerts.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("alerts.delete.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
