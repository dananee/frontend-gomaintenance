"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MaintenanceTemplate, MaintenanceIntervalType } from "../types/maintenance.types";
import { Plus, Trash2 } from "lucide-react";

interface MaintenanceTemplateFormProps {
  initialData?: MaintenanceTemplate;
  onSubmit: (data: Partial<MaintenanceTemplate>) => void;
  onCancel: () => void;
}

export function MaintenanceTemplateForm({ initialData, onSubmit, onCancel }: MaintenanceTemplateFormProps) {
  const [tasks, setTasks] = useState<string[]>(initialData?.tasks || [""]);
  
  const { register, handleSubmit, setValue, watch } = useForm<Partial<MaintenanceTemplate>>({
    defaultValues: initialData || {
      name: "",
      description: "",
      intervals: [{ type: "distance", value: 5000, unit: "km" }],
      vehicle_types: [],
    },
  });

  const handleAddTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const onFormSubmit = (data: Partial<MaintenanceTemplate>) => {
    onSubmit({
      ...data,
      tasks: tasks.filter(t => t.trim() !== ""),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Template" : "Create Maintenance Template"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template Name</label>
            <Input {...register("name", { required: true })} placeholder="e.g., Oil Change Service A" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea {...register("description")} placeholder="Describe the maintenance procedure..." />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Interval Rules</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs text-gray-500">Type</label>
                <Select 
                  defaultValue="distance" 
                  onValueChange={(val) => setValue("intervals.0.type", val as MaintenanceIntervalType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance (km)</SelectItem>
                    <SelectItem value="time">Time (months)</SelectItem>
                    <SelectItem value="engine_hours">Engine Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs text-gray-500">Value</label>
                <Input 
                  type="number" 
                  {...register("intervals.0.value", { valueAsNumber: true })} 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Task Checklist</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={task} 
                    onChange={(e) => handleTaskChange(index, e.target.value)}
                    placeholder={`Task ${index + 1}`}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveTask(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Template</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
