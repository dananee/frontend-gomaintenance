"use client";

import { WorkOrderForm } from "@/features/workOrders/components/WorkOrderForm";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function TechnicianReportPage() {
    const t = useTranslations("workOrders");
    const router = useRouter();

    const handleSuccess = () => {
        toast.success(t("toasts.createSuccess"));
        router.push("/technician/tasks");
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="container max-w-2xl py-6 mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                    {t("reportIssue")}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {t("reportIssueDescription")}
                </p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <WorkOrderForm
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
