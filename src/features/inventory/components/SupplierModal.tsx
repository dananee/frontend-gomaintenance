"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Supplier } from "../types/inventory.types";
import { useTranslations } from "next-intl";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier;
  onSave: (supplier: Partial<Supplier>) => void;
}

export function SupplierModal({
  isOpen,
  onClose,
  supplier,
  onSave,
}: SupplierModalProps) {
  const t = useTranslations("suppliers.modal");
  const { register, handleSubmit, reset } = useForm<Partial<Supplier>>({
    defaultValues: supplier || {
      name: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  const onSubmit = (data: Partial<Supplier>) => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle>
            {supplier ? t("title.edit") : t("title.add")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supplier-name">{t("fields.name")}</Label>
            <Input
              id="supplier-name"
              {...register("name", { required: true })}
              placeholder={t("placeholders.name")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">{t("fields.contact")}</Label>
              <Input
                id="contact-name"
                {...register("contact_name")}
                placeholder={t("placeholders.contact")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("fields.phone")}</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder={t("placeholders.phone")}
                type="tel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("fields.email")}</Label>
            <Input
              id="email"
              {...register("email")}
              placeholder={t("placeholders.email")}
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t("fields.address")}</Label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder={t("placeholders.address")}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("fields.notes")}</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder={t("placeholders.notes")}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit">
              {supplier ? t("actions.save") : t("actions.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
