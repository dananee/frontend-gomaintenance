"use client";

import { useAudits, useCreateAudit } from "@/features/inventory/hooks/useAudits";
import { useWarehouses } from "@/features/inventory/hooks/useWarehouses";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Package, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";

export default function AuditsPage() {
  const { user } = useAuth();
  const t = useTranslations("audits");
  const { data: audits, isLoading } = useAudits();
  const { data: warehouses } = useWarehouses(true);
  const createAuditMutation = useCreateAudit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAudit, setNewAudit] = useState({ name: "", warehouse_id: "", description: "" });

  const handleCreate = async () => {
    await createAuditMutation.mutateAsync({
      name: newAudit.name,
      warehouse_id: newAudit.warehouse_id,
      description: newAudit.description
    });
    setIsModalOpen(false);
    setNewAudit({ name: "", warehouse_id: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("actions.new")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("table.headers.recentSessions") || "Recent Sessions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.headers.name")}</TableHead>
                <TableHead>{t("table.headers.warehouse")}</TableHead>
                <TableHead>{t("table.headers.status")}</TableHead>
                <TableHead>{t("table.headers.createdAt")}</TableHead>
                <TableHead>{t("table.headers.createdBy")}</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits?.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.name}</TableCell>
                  <TableCell>{audit.warehouse?.name || "Global"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      audit.status === "VALIDATED" ? "default" :
                      audit.status === "IN_PROGRESS" ? "secondary" :
                      audit.status === "CANCELLED" ? "destructive" : "outline"
                    }>
                      {audit.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(audit.created_at), "PPP")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {audit.created_user?.first_name} {audit.created_user?.last_name}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/inventory/audits/${audit.id}`}>
                      <Button variant="ghost" size="sm">
                        {t("table.actions.details") || "Details"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {audits?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    {t("table.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("modal.title")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("modal.fields.name")}</Label>
              <Input 
                placeholder={t("modal.placeholders.name")} 
                value={newAudit.name}
                onChange={(e) => setNewAudit({ ...newAudit, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("modal.fields.warehouse")}</Label>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Managed in Settings</span>
              </div>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={newAudit.warehouse_id}
                onChange={(e) => setNewAudit({ ...newAudit, warehouse_id: e.target.value })}
              >
                <option value="">{t("modal.placeholders.warehouse")}</option>
                {warehouses?.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              {(!warehouses || warehouses.length === 0) && (user?.role === "admin" || user?.role === "manager") && (
                <div className="mt-1">
                    <Link 
                        href="/dashboard/settings/inventory/warehouses"
                        className="text-xs text-primary hover:underline flex items-center py-1 gap-1"
                    >
                        <Plus className="h-3 w-3" />
                        Configure Warehouses in Settings
                    </Link>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("modal.fields.description")}</Label>
              <Input 
                placeholder={t("modal.placeholders.description")} 
                value={newAudit.description}
                onChange={(e) => setNewAudit({ ...newAudit, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t("common.cancel") || "Cancel"}</Button>
            <Button onClick={handleCreate} disabled={!newAudit.name || !newAudit.warehouse_id}>
              {t("modal.actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
