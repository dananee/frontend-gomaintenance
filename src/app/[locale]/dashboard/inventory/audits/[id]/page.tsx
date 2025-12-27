"use client";

import { useAudit, useUpdateAuditLines, useValidateAudit } from "@/features/inventory/hooks/useAudits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, ChevronLeft, Save, Filter } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

export default function AuditDetailPage() {
  const t = useTranslations("audits");
  const commonT = useTranslations("common");
  const { id } = useParams();
  const { data: audit, isLoading } = useAudit(id as string);
  const updateLinesMutation = useUpdateAuditLines(id as string);
  const validateMutation = useValidateAudit(id as string);
  
  const [lineChanges, setLineChanges] = useState<Record<string, { physical_quantity: number, adjustment_reason?: string }>>({});

  useEffect(() => {
    if (audit?.lines) {
        const initialChanges: Record<string, { physical_quantity: number, adjustment_reason?: string }> = {};
        audit.lines.forEach(line => {
            initialChanges[line.part_id] = {
                physical_quantity: line.physical_quantity,
                adjustment_reason: line.adjustment_reason
            };
        });
        setLineChanges(initialChanges);
    }
  }, [audit?.lines]);

  const handleLineChange = (partId: string, field: string, value: any) => {
    setLineChanges(prev => ({
        ...prev,
        [partId]: {
            ...prev[partId],
            [field]: value
        }
    }));
  };

  const handleSave = async () => {
    const lines = Object.entries(lineChanges).map(([partId, data]) => ({
        part_id: partId,
        ...data
    }));
    await updateLinesMutation.mutateAsync(lines);
  };

  const handleValidate = async () => {
    if (confirm(t("details.validateConfirm"))) {
        await validateMutation.mutateAsync();
    }
  };

  if (isLoading) return <div className="p-8 text-center">{commonT("loading") || "Loading..."}</div>;
  if (!audit) return <div className="p-8 text-center">{t("details.notFound") || "Audit not found"}</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory/audits">
          <Button variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{audit.name}</h1>
          <p className="text-muted-foreground">
            {t("table.headers.warehouse")}: {audit.warehouse?.name || "Global"} • 
            {t("table.headers.createdAt")} {format(new Date(audit.created_at), "PPP")}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          {audit.status !== "VALIDATED" && audit.status !== "CANCELLED" && (
            <>
                <Button variant="outline" onClick={handleSave} disabled={updateLinesMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {t("actions.saveDraft")}
                </Button>
                <Button onClick={handleValidate} disabled={validateMutation.isPending}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {t("actions.validate")}
                </Button>
            </>
          )}
          {audit.status === "VALIDATED" && (
            <Badge variant="default" className="px-4 py-2 text-md flex items-center bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("status.validated") || "Validated"} {t("on") || "on"} {audit.validated_at && format(new Date(audit.validated_at), "PPP")}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="border-b pb-4">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{t("details.title")}</CardTitle>
                    <CardDescription>{t("details.description")}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        {t("details.scopeLabel") || "Scope"}
                    </span>
                    <Badge variant="outline" className="capitalize">
                        {audit.scope === "ALL" ? t("modal.scopes.all") : 
                         audit.scope === "WITH_STOCK" ? t("modal.scopes.withStock") : 
                         t("modal.scopes.category")}
                    </Badge>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">{t("table.headers.partName") || "Part Name"}</TableHead>
                  <TableHead>{t("table.headers.sku") || "SKU"}</TableHead>
                  <TableHead className="text-right">{t("table.headers.systemQty")}</TableHead>
                  <TableHead className="w-[120px]">{t("table.headers.physicalQty")}</TableHead>
                  <TableHead className="text-right pr-6">{t("table.headers.diff")}</TableHead>
                  <TableHead>{t("table.headers.reason")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audit.lines?.map((line) => {
                  const currentPhysical = lineChanges[line.part_id]?.physical_quantity ?? 0;
                  const diff = currentPhysical - line.system_quantity;
                  
                  return (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium pl-6">{line.part?.name}</TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">
                        {line.part?.sku || line.part?.part_number}
                      </TableCell>
                      <TableCell className="text-right font-semibold">{line.system_quantity}</TableCell>
                      <TableCell>
                        <Input 
                            type="number" 
                            className="h-8 w-20 text-right"
                            value={currentPhysical}
                            disabled={audit.status === "VALIDATED"}
                            onChange={(e) => handleLineChange(line.part_id, "physical_quantity", parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell className={`text-right font-bold pr-6 ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-600" : "text-muted-foreground"}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </TableCell>
                      <TableCell>
                        <Input 
                            placeholder={t("table.headers.reason") + "..."} 
                            className="h-8"
                            value={lineChanges[line.part_id]?.adjustment_reason || ""}
                            disabled={audit.status === "VALIDATED"}
                            onChange={(e) => handleLineChange(line.part_id, "adjustment_reason", e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("details.summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("table.headers.status")}</span>
                        <Badge variant={audit.status === "VALIDATED" ? "default" : "outline"}>
                            {audit.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("details.totalParts")}</span>
                        <span className="font-bold text-lg">{audit.lines?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <span className="text-sm text-muted-foreground">{t("table.headers.createdBy")}</span>
                        <span className="text-sm font-medium">{audit.created_user?.first_name} {audit.created_user?.last_name}</span>
                    </div>
                    {audit.description && (
                        <div className="space-y-1 pt-2">
                             <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("modal.fields.description")}</span>
                             <p className="text-sm bg-muted/50 p-2 rounded border">{audit.description}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {audit.status === "VALIDATED" && (
                <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            {t("details.stockSyncedTitle")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-emerald-700/80 dark:text-emerald-500/80 leading-relaxed">
                            {t("details.stockSyncedDesc")}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
