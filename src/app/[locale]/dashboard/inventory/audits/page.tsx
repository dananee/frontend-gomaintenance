"use client";

import { useAudits, useCreateAudit } from "@/features/inventory/hooks/useAudits";
import { useWarehouses } from "@/features/inventory/hooks/useWarehouses";
import { usePartCategories } from "@/features/inventory/hooks/usePartCategories";
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
import { Plus, Package, Calendar, User, ArrowRight, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AuditsPage() {
  const { user } = useAuth();
  const t = useTranslations("audits");
  const { data: audits, isLoading } = useAudits();
  const { data: warehouses } = useWarehouses(true);
  const { data: categories } = usePartCategories();
  const createAuditMutation = useCreateAudit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAudit, setNewAudit] = useState({ 
    name: "", 
    warehouse_id: "", 
    description: "",
    scope_type: "ALL",
    scope_category_id: ""
  });

  const handleCreate = async () => {
    await createAuditMutation.mutateAsync({
      name: newAudit.name,
      warehouse_id: newAudit.warehouse_id,
      description: newAudit.description,
      scope_type: newAudit.scope_type,
      scope_category_id: newAudit.scope_type === "CATEGORY" ? newAudit.scope_category_id : undefined
    });
    setIsModalOpen(false);
    setNewAudit({ 
      name: "", 
      warehouse_id: "", 
      description: "",
      scope_type: "ALL",
      scope_category_id: ""
    });
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
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            {t("table.headers.recentSessions") || "Recent Sessions"}
          </CardTitle>
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
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{audit.name}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Filter className="h-2 w-2" />
                            {audit.scope_type === "ALL" ? t("modal.scopes.all") : 
                             audit.scope_type === "IN_STOCK_ONLY" ? t("modal.scopes.withStock") : 
                             t("modal.scopes.category")}
                        </span>
                    </div>
                  </TableCell>
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
        <DialogContent className="sm:max-w-[425px]">
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
              <Select 
                value={newAudit.warehouse_id}
                onValueChange={(value) => setNewAudit({ ...newAudit, warehouse_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("modal.placeholders.warehouse")} />
                </SelectTrigger>
                <SelectContent>
                  {warehouses?.map(w => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("modal.fields.scope")}</Label>
              <Select 
                value={newAudit.scope_type}
                onValueChange={(value) => setNewAudit({ ...newAudit, scope_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("modal.placeholders.scope")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("modal.scopes.all")}</SelectItem>
                  <SelectItem value="IN_STOCK_ONLY">{t("modal.scopes.withStock")}</SelectItem>
                  <SelectItem value="CATEGORY">{t("modal.scopes.category")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newAudit.scope_type === "CATEGORY" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                <Label>{t("modal.fields.scopeCategory")}</Label>
                <Select 
                  value={newAudit.scope_category_id}
                  onValueChange={(value) => setNewAudit({ ...newAudit, scope_category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("inventory.details.editModal.placeholders.category") || "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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
            <Button onClick={handleCreate} disabled={!newAudit.name || !newAudit.warehouse_id || (newAudit.scope_type === "CATEGORY" && !newAudit.scope_category_id)}>
              {t("modal.actions.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
