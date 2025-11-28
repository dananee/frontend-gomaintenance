"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function NotificationSettingsForm() {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      email: {
        workOrders: true,
        inventory: true,
        maintenance: true,
        marketing: false,
      },
      push: {
        workOrders: true,
        inventory: false,
        maintenance: true,
      },
    },
  });

  // Helper to handle switch changes
  const handleSwitchChange = (path: string, value: boolean) => {
    setValue(path as any, value);
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how and when you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Work Order Updates</Label>
                  <p className="text-xs text-gray-500">Receive emails when work orders are assigned or updated.</p>
                </div>
                <Switch 
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange("email.workOrders", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-xs text-gray-500">Get notified when inventory items fall below minimum quantity.</p>
                </div>
                <Switch 
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange("email.inventory", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Reminders</Label>
                  <p className="text-xs text-gray-500">Weekly summary of upcoming and overdue maintenance.</p>
                </div>
                <Switch 
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange("email.maintenance", checked)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Real-time Alerts</Label>
                  <p className="text-xs text-gray-500">Instant notifications for critical issues.</p>
                </div>
                <Switch 
                  defaultChecked={true}
                  onCheckedChange={(checked) => handleSwitchChange("push.workOrders", checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Preferences</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
