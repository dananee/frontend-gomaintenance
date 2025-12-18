"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  bio: string;
}

export function ProfileSettingsForm() {
  const { profile, isLoading, updateProfile, isUpdating, uploadAvatar, isUploading } = useProfile();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const t = useTranslations("settings.profile");

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ProfileFormValues>();

  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        job_title: profile.job_title,
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile({
      first_name: data.first_name,
      last_name: data.last_name,
      job_title: data.job_title,
      bio: data.bio,
    });
    // Reset dirty state with new values
    reset(data);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);

      try {
        await uploadAvatar(file);
      } catch (error) {
        // Revert preview on error
        setAvatarPreview(null);
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
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-9 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview || "/avatars/01.png"} alt="Avatar" />
              <AvatarFallback>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <Input
                type="file"
                className="hidden"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={isUploading}
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("avatar.uploading")}
                  </>
                ) : (
                  t("avatar.change")
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("form.firstName")}</label>
              <Input {...register("first_name")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("form.lastName")}</label>
              <Input {...register("last_name")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.email")}</label>
            <Input {...register("email")} disabled className="bg-gray-100 dark:bg-gray-800" />
            <p className="text-xs text-muted-foreground">{t("form.emailHelp")}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.jobTitle")}</label>
            <Input {...register("job_title")} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("form.bio")}</label>
            <Textarea {...register("bio")} placeholder={t("form.bioPlaceholder")} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("form.save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
