"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyFormValues {
  companyName: string;
  website: string;
  address: string;
  city: string;
  country: string;
}

export function CompanySettingsForm() {
  const { register, handleSubmit } = useForm<CompanyFormValues>({
    defaultValues: {
      companyName: "Acme Logistics",
      website: "https://acme-logistics.com",
      address: "123 Transport Way",
      city: "New York",
      country: "USA",
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <CardDescription>Manage your company information and address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input {...register("companyName")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input {...register("website")} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input {...register("address")} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input {...register("city")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Input {...register("country")} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
