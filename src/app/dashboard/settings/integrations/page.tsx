"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

const integrations = [
  {
    id: "samsara",
    name: "Samsara",
    description: "Sync vehicle locations, odometers, and engine faults.",
    status: "connected",
    icon: "/logos/samsara.png", // Mock path
  },
  {
    id: "geotab",
    name: "Geotab",
    description: "Advanced telematics and fleet management integration.",
    status: "disconnected",
    icon: "/logos/geotab.png",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sync parts inventory costs and work order invoices.",
    status: "disconnected",
    icon: "/logos/quickbooks.png",
  },
];

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>Connect with third-party services to sync data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {integration.name[0]}
                  </div>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {integration.status === "connected" ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 text-gray-500">
                      <XCircle className="h-3 w-3" />
                      Disconnected
                    </Badge>
                  )}
                  <Button variant={integration.status === "connected" ? "outline" : "secondary"} size="sm">
                    {integration.status === "connected" ? "Configure" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
