"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, User } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignee?: string;
}

interface WorkOrderTasksProps {
  workOrderId?: string;
  tasks?: Task[];
  onTaskToggle?: (taskId: string, completed: boolean) => void;
}

export function WorkOrderTasks({
  tasks = [],
  onTaskToggle,
}: WorkOrderTasksProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(
    tasks.length > 0
      ? tasks
      : [
          {
            id: "1",
            title: "Inspect brake lines",
            description: "Check for leaks and wear",
            completed: true,
            assignee: "Alex Johnson",
          },
          {
            id: "2",
            title: "Replace brake pads",
            description: "Install new ceramic brake pads",
            completed: false,
            assignee: "Jamie Smith",
          },
          {
            id: "3",
            title: "Test brake system",
            description: "Perform full brake system test",
            completed: false,
            assignee: "Alex Johnson",
          },
        ]
  );

  const handleToggle = (taskId: string) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    const task = localTasks.find((t) => t.id === taskId);
    if (task && onTaskToggle) {
      onTaskToggle(taskId, !task.completed);
    }
  };

  const completedCount = localTasks.filter((t) => t.completed).length;
  const totalCount = localTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Task Progress
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {localTasks.map((task) => (
          <Card
            key={task.id}
            className={`transition-all ${
              task.completed ? "opacity-70" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleToggle(task.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`cursor-pointer font-medium text-gray-900 dark:text-gray-100 ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                  )}
                  {task.assignee && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <User className="h-3.5 w-3.5" />
                      <span>{task.assignee}</span>
                    </div>
                  )}
                </div>
                {task.completed && (
                  <Badge variant="success" className="shrink-0">
                    Done
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {localTasks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tasks yet
            </p>
            <Button variant="outline" className="mt-4" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add First Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
