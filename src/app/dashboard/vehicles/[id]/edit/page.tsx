"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "@/features/vehicles/api/getVehicle";
import { VehicleForm } from "@/features/vehicles/components/VehicleForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function EditVehiclePage() {
  const t = useTranslations("vehicles");
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const { data: vehicle, isLoading, error } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => getVehicle(vehicleId),
    enabled: !!vehicleId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-500">{t("errors.notFound")}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/dashboard/vehicles")}
            >
              {t("actions.backToList")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href={`/dashboard/vehicles/${vehicleId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("actions.back")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("edit.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm
            initialData={vehicle}
            onSuccess={() => router.push(`/dashboard/vehicles/${vehicleId}`)}
            onCancel={() => router.push(`/dashboard/vehicles/${vehicleId}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
