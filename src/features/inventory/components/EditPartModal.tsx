"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Part, UpdatePartRequest } from "../types/inventory.types";
import { Loader2, AlertCircle, Plus, Check, X } from "lucide-react";
import { usePartCategories } from "../hooks/usePartCategories";
import { useSuppliers } from "../hooks/useSuppliers";
import { useCreatePartCategory } from "../hooks/useCategoryMutations";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partSchema, PartFormValues } from "../validations/part.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface EditPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  part?: Part;
  onSave: (data: Partial<Part>) => void;
  isSaving?: boolean;
}

const VAT_OPTIONS = [0, 7, 10, 14, 20];

export function EditPartModal({ isOpen, onClose, part, onSave, isSaving = false }: EditPartModalProps) {
  const t = useTranslations("inventory.details.editModal");

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: "",
      part_number: "",
      sku: "",
      unit_price_ht: 0,
      vat_rate: 20,
      is_critical: false,
      min_quantity: 0,
      description: "",
      brand: "",
      category_id: "",
      supplier_id: "",
      unit: "piece",
      default_location: "",
    },
  });

  const { data: categories } = usePartCategories();
  const { data: suppliersData } = useSuppliers({ page_size: 100 });
  const suppliers = suppliersData?.data || [];

  const createCategoryMutation = useCreatePartCategory();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const watchedPriceHT = form.watch("unit_price_ht");
  const watchedVAT = form.watch("vat_rate");

  const priceTTC = useMemo(() => {
    const ht = watchedPriceHT || 0;
    const vat = watchedVAT || 0;
    return ht * (1 + vat / 100);
  }, [watchedPriceHT, watchedVAT]);

  useEffect(() => {
    if (isOpen) {
      if (part) {
        form.reset({
          name: part.name || "",
          part_number: part.part_number || "",
          sku: part.sku || "",
          unit_price_ht: part.unit_price_ht || 0,
          vat_rate: part.vat_rate || 20,
          is_critical: part.is_critical || false,
          min_quantity: part.min_quantity || 0,
          description: part.description || "",
          brand: part.brand || "",
          category_id: part.category_id || "",
          supplier_id: part.supplier_id || "",
          unit: part.unit || "piece",
          default_location: part.default_location || "",
        });
      } else {
        form.reset({
          name: "",
          part_number: "",
          sku: "",
          unit_price_ht: 0,
          vat_rate: 20,
          is_critical: false,
          min_quantity: 0,
          description: "",
          brand: "",
          category_id: "",
          supplier_id: "",
          unit: "piece",
          default_location: "",
        });
      }
    }
  }, [isOpen, part, form]);

  const onSubmit = (data: PartFormValues) => {
    onSave(data);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await createCategoryMutation.mutateAsync({ name: newCategoryName });
      form.setValue("category_id", newCat.id, { shouldDirty: true });
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleQuickAddCategory = async (name: string) => {
    try {
      const newCat = await createCategoryMutation.mutateAsync({ name });
      form.setValue("category_id", newCat.id, { shouldDirty: true });
    } catch (error) {
      // If it already exists or fails, it willtoast
    }
  };

  const handleClose = () => {
    if (form.formState.isDirty) {
      if (window.confirm(t("unsavedChanges") || "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => {
          if (form.formState.isDirty) {
            e.preventDefault();
            if (window.confirm(t("unsavedChanges") || "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?")) {
              onClose();
            }
          }
        }}
        onEscapeKeyDown={(e) => {
          if (form.formState.isDirty) {
            e.preventDefault();
            if (window.confirm(t("unsavedChanges") || "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?")) {
              onClose();
            }
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{part ? t("title.edit") : t("title.create")}</DialogTitle>
          <DialogDescription>
            {part
              ? t("description.edit", { name: part.name })
              : t("description.create")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.brand") || "General Info"}</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        {t("fields.name")} <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="part_number"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("fields.part_number")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("placeholders.part_number")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("fields.sku")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("placeholders.sku")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>{t("fields.brand")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>{t("fields.unit")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("placeholders.unit")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="piece">{t("units.piece")}</SelectItem>
                            <SelectItem value="liter">{t("units.liter")}</SelectItem>
                            <SelectItem value="kg">{t("units.kg")}</SelectItem>
                            <SelectItem value="set">{t("units.set")}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Accounting & Inventory */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("fields.price") || "Accounting"}</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="unit_price_ht"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>{t("fields.price")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vat_rate"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>{t("fields.vat_rate")}</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VAT_OPTIONS.map(rate => (
                              <SelectItem key={rate} value={rate.toString()}>{rate}%</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border border-dashed text-sm">
                  <div className="flex justify-between items-center font-bold">
                    <span>{t("fields.price_ttc")}</span>
                    <span className="text-lg">{priceTTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-normal text-muted-foreground">MAD</span></span>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="min_quantity"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("fields.minQuantity")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="default_location"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("fields.location")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("placeholders.location")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_critical"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium flex items-center gap-1.5 cursor-pointer">
                        {t("fields.is_critical")}
                        {field.value && <AlertCircle className="h-4 w-4 text-amber-500 fill-amber-500/10" />}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("fields.category")}</FormLabel>
                      {!isAddingCategory && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs gap-1"
                          onClick={() => setIsAddingCategory(true)}
                        >
                          <Plus className="h-3 w-3" />
                          {t("addCategory")}
                        </Button>
                      )}
                    </div>
                    {isAddingCategory ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder={t("placeholders.newCategory") || "Category name..."}
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCategory();
                            }
                            if (e.key === "Escape") setIsAddingCategory(false);
                          }}
                          className="h-10"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="h-10 w-10 shrink-0"
                          onClick={handleAddCategory}
                          disabled={createCategoryMutation.isPending}
                        >
                          {createCategoryMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-10 w-10 shrink-0"
                          onClick={() => setIsAddingCategory(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                        value={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("placeholders.category")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t("placeholders.none")}</SelectItem>
                          {categories?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                          {/* Suggestions for default categories if they don't exist */}
                          {!categories?.some(c => c.name.toLowerCase() === t("defaultCategories.electric").toLowerCase()) && (
                            <div className="p-2 border-t mt-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 px-2">{t("placeholders.none") === "None" ? "Suggestions" : "Suggestions"}</p>
                              {["electric", "chemical", "hydraulic"].map(catKey => {
                                const localizedName = t(`defaultCategories.${catKey}`);
                                if (categories?.some(c => c.name.toLowerCase() === localizedName.toLowerCase())) return null;
                                return (
                                  <button
                                    key={catKey}
                                    type="button"
                                    className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
                                    onClick={() => handleQuickAddCategory(localizedName)}
                                  >
                                    <Plus className="h-3 w-3" />
                                    {localizedName}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>{t("fields.supplier")}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "none" ? "" : value)}
                      defaultValue={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("placeholders.supplier")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t("placeholders.none")}</SelectItem>
                        {suppliers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("fields.description")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSaving}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
