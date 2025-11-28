"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function BrandingSettingsForm() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      primaryColor: "#3b82f6",
      accentColor: "#f59e0b",
      logoUrl: "",
    },
  });

  const primaryColor = watch("primaryColor");
  const accentColor = watch("accentColor");

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding & Appearance</CardTitle>
        <CardDescription>Customize the look and feel of your workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Theme Colors</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    {...register("primaryColor")} 
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    {...register("primaryColor")} 
                    className="font-mono uppercase"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    {...register("accentColor")} 
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input 
                    {...register("accentColor")} 
                    className="font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Logo</h3>
            <div className="flex items-center gap-4 p-4 border rounded-lg border-dashed">
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                Preview
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload new logo</p>
                <p className="text-xs text-gray-500">Recommended size: 512x512px. Max 2MB.</p>
                <Input type="file" className="max-w-xs" />
              </div>
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
