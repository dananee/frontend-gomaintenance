"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/hooks/useCompany";
import { Loader2, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";

interface CompanyFormValues {
  companyName: string;
  website: string;
  address: string;
  city: string;
  country: string;
}

export function CompanySettingsForm() {
  const { company, isLoading, updateCompany, isUpdating, error } = useCompany();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<CompanyFormValues>();

  useEffect(() => {
    if (company) {
      reset({
        companyName: company.name,
        website: company.website,
        address: company.address,
        city: company.city,
        country: company.country,
      });
    }
  }, [company, reset]);

  const onSubmit = async (data: CompanyFormValues) => {
    await updateCompany({
      name: data.companyName,
      website: data.website,
      address: data.address,
      city: data.city,
      country: data.country,
    });
    // Reset dirty state
    reset(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user is not admin, show read-only view or restricted message
  // But let's just disable inputs instead of hiding

  return (
    <Card className="relative">
      {!isAdmin && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 shadow-lg flex flex-col items-center gap-3 text-center max-w-sm">
            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Access Restricted</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Only administrators can modify company settings. Please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <CardDescription>Manage your company information and address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input {...register("companyName")} disabled={!isAdmin} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input {...register("website")} disabled={!isAdmin} placeholder="https://example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input {...register("address")} disabled={!isAdmin} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input {...register("city")} disabled={!isAdmin} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input {...register("country")} disabled={!isAdmin} />
            </div>
          </div>

          {isAdmin && (
            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty || isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
