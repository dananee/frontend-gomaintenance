"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranding } from "@/hooks/useBranding";
import { Loader2, Lock, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface BrandingFormValues {
  primary_color: string;
  accent_color: string;
}

export function BrandingSettingsForm() {
  const { branding, isLoading, updateBranding, isUpdating, uploadLogo, isUploading } = useBranding();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const t = useTranslations("settings.branding");

  const { register, handleSubmit, reset, watch, formState: { isDirty } } = useForm<BrandingFormValues>();

  const primaryColor = watch("primary_color");
  const accentColor = watch("accent_color");

  useEffect(() => {
    if (branding) {
      reset({
        primary_color: branding.primary_color,
        accent_color: branding.accent_color,
      });
      if (branding.logo_url) {
        setLogoPreview(branding.logo_url);
      }
    }
  }, [branding, reset]);

  const onSubmit = async (data: BrandingFormValues) => {
    await updateBranding({
      ...data,
      logo_url: branding?.logo_url || "",
    });
    reset(data);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);

      try {
        await uploadLogo(file);
      } catch (error) {
        setLogoPreview(branding?.logo_url || null);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative">
      {!isAdmin && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 shadow-lg flex flex-col items-center gap-3 text-center max-w-sm">
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("accessRestricted.title")}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("accessRestricted.description")}
              </p>
            </div>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t("form.companyLogo")}</h3>
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 border border-dashed rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">{t("form.noLogo")}</span>
                )}
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="file"
                    className="hidden"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={!isAdmin || isUploading}
                  />
                  <Button
                    variant="outline"
                    disabled={!isAdmin || isUploading}
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {t("form.uploadLogo")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("form.logoHelp")}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("form.primaryColor")}</label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-9 w-9 rounded border shadow-sm shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input
                    {...register("primary_color")}
                    disabled={!isAdmin}
                    placeholder="#000000"
                  />
                  <Input
                    type="color"
                    className="w-12 p-0 h-9 border-0 shrink-0 cursor-pointer"
                    {...register("primary_color")}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("form.accentColor")}</label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-9 w-9 rounded border shadow-sm shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Input
                    {...register("accent_color")}
                    disabled={!isAdmin}
                    placeholder="#000000"
                  />
                  <Input
                    type="color"
                    className="w-12 p-0 h-9 border-0 shrink-0 cursor-pointer"
                    {...register("accent_color")}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex justify-end">
                <Button type="submit" disabled={!isDirty || isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("form.save")}
                </Button>
              </div>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
