"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { Plus, User, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";

type TaskStatus = "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status?: TaskStatus;
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
  const { isOpen, open, close } = useModal();
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
  });
  const [localTasks, setLocalTasks] = useState<Task[]>(
    tasks.length > 0
      ? tasks
      : [
          {
            id: "1",
            title: "Inspect brake lines",
            description: "Check for leaks and wear",
            completed: true,
            status: "done",
            assignee: "Alex Johnson",
          },
          {
            id: "2",
            title: "Replace brake pads",
            description: "Install new ceramic brake pads",
            completed: false,
            status: "in_progress",
            assignee: "Jamie Smith",
          },
          {
            id: "3",
            title: "Test brake system",
            description: "Perform full brake system test",
            completed: false,
            status: "todo",
            assignee: "Alex Johnson",
          },
        ]
  );

  const handleToggle = (taskId: string) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "done" : task.status || "todo",
            }
          : task
      )
    );
    const task = localTasks.find((t) => t.id === taskId);
    if (task && onTaskToggle) {
      onTaskToggle(taskId, !task.completed);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: String(Date.now()),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      completed: false,
      status: "todo",
    };

    setLocalTasks([...localTasks, task]);
    setNewTask({ title: "", description: "", assignee: "" });
    close();
  };

  const handleDeleteTask = (taskId: string) => {
    setLocalTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const getStatusBadge = (status?: TaskStatus) => {
    switch (status) {
      case "done":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            Done
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            In Progress
          </Badge>
        );
      case "todo":
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
          >
            To Do
          </Badge>
        );
    }
  };

  const completedCount = localTasks.filter((t) => t.completed).length;
  const totalCount = localTasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Checklist</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {completedCount} of {totalCount} tasks completed
              </p>
            </div>
            <Button size="sm" onClick={open}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {localTasks.map((task) => (
              <div
                key={task.id}
                className={`group rounded-lg border border-gray-200 dark:border-gray-800 p-4 transition-all hover:shadow-sm ${
                  task.completed ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`cursor-pointer font-medium text-gray-900 dark:text-gray-100 ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.title}
                      </label>
                      {getStatusBadge(task.status)}
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {task.description}
                      </p>
                    )}
                    {task.assignee && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-xs text-blue-700 dark:text-blue-400">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteTask(task.id)}
                      title="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {localTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No tasks yet
              </p>
              <Button
                variant="outline"
                className="mt-4"
                size="sm"
                onClick={open}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Task
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Add New Task"
        description="Create a task for this work order"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">Task Title *</Label>
            <Input
              id="task-title"
              placeholder="e.g., Replace brake pads"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Add details about this task..."
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="task-assignee">Assign To</Label>
            <Input
              id="task-assignee"
              placeholder="Technician name"
              value={newTask.assignee}
              onChange={(e) =>
                setNewTask({ ...newTask, assignee: e.target.value })
              }
              className="mt-1.5"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={!newTask.title.trim()}>
              Add Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
