import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, Phone } from "lucide-react";
import { Supplier } from "../types/inventory.types";

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export function SupplierStats({ suppliers }: SupplierStatsProps) {
  const totalSuppliers = suppliers.length;
  const withEmail = suppliers.filter((s) => s.email).length;
  const withPhone = suppliers.filter((s) => s.phone).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Suppliers
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <Building2 className="h-4 w-4 text-gray-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalSuppliers}</div>
          <p className="text-xs text-muted-foreground mt-1">Active suppliers</p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            With Email
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{withEmail}</div>
          <p className="text-xs text-muted-foreground mt-1">Email contacts</p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            With Phone
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
            <Phone className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{withPhone}</div>
          <p className="text-xs text-muted-foreground mt-1">Phone contacts</p>
        </CardContent>
      </Card>
    </div>
  );
}
