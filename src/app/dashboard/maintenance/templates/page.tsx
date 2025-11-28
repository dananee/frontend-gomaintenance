"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaintenanceTemplateForm } from "@/features/maintenance/components/MaintenanceTemplateForm";
import { MaintenanceTemplate } from "@/features/maintenance/types/maintenance.types";
import { Plus, FileText, Clock, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MaintenanceTemplatesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Mock data
  const [templates, setTemplates] = useState<MaintenanceTemplate[]>([
    {
      id: "1",
      name: "Basic Oil Change",
      description: "Standard oil change and filter replacement",
      vehicle_types: ["truck", "van"],
      intervals: [{ type: "distance", value: 5000, unit: "km" }],
      tasks: ["Drain oil", "Replace oil filter", "Fill new oil", "Check fluid levels"],
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "2",
      name: "Annual Inspection",
      description: "Comprehensive yearly vehicle inspection",
      vehicle_types: ["all"],
      intervals: [{ type: "time", value: 12, unit: "months" }],
      tasks: ["Check brakes", "Inspect tires", "Test battery", "Check lights", "Inspect suspension"],
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
    },
  ]);

  const handleCreate = (data: Partial<MaintenanceTemplate>) => {
    const newTemplate: MaintenanceTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || "New Template",
      description: data.description,
      vehicle_types: data.vehicle_types || [],
      intervals: data.intervals || [],
      tasks: data.tasks || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
    setIsCreating(false);
  };

  const handleUpdate = (data: Partial<MaintenanceTemplate>) => {
    if (!editingId) return;
    setTemplates(templates.map(t => t.id === editingId ? { ...t, ...data } as MaintenanceTemplate : t));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto">
        <MaintenanceTemplateForm 
          onSubmit={handleCreate} 
          onCancel={() => setIsCreating(false)} 
        />
      </div>
    );
  }

  if (editingId) {
    const template = templates.find(t => t.id === editingId);
    return (
      <div className="max-w-2xl mx-auto">
        <MaintenanceTemplateForm 
          initialData={template}
          onSubmit={handleUpdate} 
          onCancel={() => setEditingId(null)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Templates</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage preventive maintenance schedules and checklists</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="outline" className="capitalize">
                  {template.intervals[0].type.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {template.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Every {template.intervals[0].value} {template.intervals[0].unit}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{template.tasks.length} tasks defined</span>
              </div>

              <div className="mt-auto pt-4 flex gap-2 justify-end border-t border-gray-100 dark:border-gray-800">
                <Button variant="ghost" size="sm" onClick={() => setEditingId(template.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(template.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
