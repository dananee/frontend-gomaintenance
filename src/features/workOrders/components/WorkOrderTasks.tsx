"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Loader2,
  MoreVertical,
  ListTodo,
  Calendar,
  User,
} from "lucide-react";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  listWorkOrderTasks,
  createWorkOrderTask,
  updateWorkOrderTask,
  deleteWorkOrderTask,
} from "../api/workOrderTasks";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export function WorkOrderTasks() {
  const params = useParams();
  const workOrderId = params.id as string;
  const { isOpen, open, close } = useModal();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");
  
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["workOrderTasks", workOrderId],
    queryFn: () => listWorkOrderTasks(workOrderId),
    enabled: !!workOrderId,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createWorkOrderTask(workOrderId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderTasks", workOrderId] });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setNewTaskAssignee("");
      close();
      toast.success("Task added");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, isDone }: { taskId: string; isDone: boolean }) =>
      updateWorkOrderTask(workOrderId, taskId, { is_done: isDone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderTasks", workOrderId] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteWorkOrderTask(workOrderId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderTasks", workOrderId] });
      toast.success("Task deleted");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  const handleToggle = (taskId: string, currentStatus: boolean) => {
    updateMutation.mutate({ taskId, isDone: !currentStatus });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    createMutation.mutate(newTaskTitle);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Delete this task?")) {
      deleteMutation.mutate(taskId);
    }
  };

  const completedCount = tasks.filter((t) => t.is_done).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-white dark:bg-gray-950">
        <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <ListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Task Checklist
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Manage and track work order tasks
                </p>
              </div>
            </div>
            <Button 
              onClick={open} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              title="Add a new task to this work order"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Progress Section */}
          <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  Overall Progress
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(progress)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({completedCount} of {totalCount} tasks completed)
                </span>
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Tasks List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
                <ListTodo className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                No tasks yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                Get started by adding the first task to this work order.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={open}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                      task.is_done 
                        ? "bg-gray-50 border-gray-100 dark:bg-gray-900/30 dark:border-gray-800/50" 
                        : "bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 dark:bg-gray-950 dark:border-gray-800 dark:hover:border-blue-900"
                    }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="pt-1">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.is_done}
                          onCheckedChange={() => handleToggle(task.id, task.is_done)}
                          className={`h-5 w-5 transition-all duration-300 ${
                            task.is_done 
                              ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" 
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`cursor-pointer font-semibold text-base transition-colors duration-200 ${
                              task.is_done 
                                ? "text-gray-500 line-through decoration-gray-400" 
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {task.name}
                          </label>
                          {task.is_done ? (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50 text-[10px] px-1.5 py-0 h-5"
                            >
                              Done
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50 text-[10px] px-1.5 py-0 h-5"
                            >
                              To Do
                            </Badge>
                          )}
                        </div>
                        
                        {/* Placeholder for future metadata - can be conditionally rendered if data exists */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {/* Example placeholders */}
                          {/* <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due Tomorrow</span>
                          </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggle(task.id, task.is_done)}>
                            {task.is_done ? "Mark as To Do" : "Mark as Done"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Task Modal */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Add New Task"
        description="Create a detailed task for this work order"
      >
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title <span className="text-red-500">*</span></Label>
            <Input
              id="task-title"
              placeholder="e.g., Replace brake pads"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description (Optional)</Label>
            <Textarea
              id="task-desc"
              placeholder="Add details about this task..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="resize-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-due">Due Date (Optional)</Label>
              <Input
                id="task-due"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignee">Assignee (Optional)</Label>
              <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech1">John Doe</SelectItem>
                  <SelectItem value="tech2">Jane Smith</SelectItem>
                  <SelectItem value="tech3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={close} className="h-10 px-4">
              Cancel
            </Button>
            <Button 
              onClick={handleAddTask} 
              disabled={!newTaskTitle.trim() || createMutation.isPending}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
