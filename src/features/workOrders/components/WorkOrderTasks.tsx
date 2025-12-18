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
import { useTranslations } from "next-intl";

export function WorkOrderTasks() {
  const t = useTranslations("workOrders");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");
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
      toast.success(tt("success.taskAdded"));
    },
    onError: () => {
      toast.error(tt("error.addTaskFailed"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, isDone }: { taskId: string; isDone: boolean }) =>
      updateWorkOrderTask(workOrderId, taskId, { is_done: isDone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderTasks", workOrderId] });
    },
    onError: () => {
      toast.error(tt("error.updateTaskFailed"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteWorkOrderTask(workOrderId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workOrderTasks", workOrderId] });
      toast.success(tt("success.taskDeleted"));
    },
    onError: () => {
      toast.error(tt("error.deleteTaskFailed"));
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
    if (confirm(tc("confirmDelete", { item: t("checklist.addTask") }))) {
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
                  {t("checklist.title")}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {t("checklist.subtitle")}
                </p>
              </div>
            </div>
            <Button
              onClick={open}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("checklist.addTask")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Progress Section */}
          <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                  {t("checklist.progress")}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(progress)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  {t("checklist.completedOf", { completed: completedCount, total: totalCount })}
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
                {t("checklist.noTasks")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
                {t("checklist.noTasksDesc")}
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={open}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("checklist.addFirstTask")}
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
                    className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${task.is_done
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
                          className={`h-5 w-5 transition-all duration-300 ${task.is_done
                              ? "data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`cursor-pointer font-semibold text-base transition-colors duration-200 ${task.is_done
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
                              {t("checklist.done")}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50 text-[10px] px-1.5 py-0 h-5"
                            >
                              {t("checklist.todo")}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          {/* <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{t("checklist.dueTomorrow")}</span>
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
                            {task.is_done ? t("checklist.markToDo") : t("checklist.markDone")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {tc("delete")}
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
        title={t("form.title")}
        description={t("form.description")}
      >
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="task-title">{t("form.fields.title")} <span className="text-red-500">*</span></Label>
            <Input
              id="task-title"
              placeholder={t("form.fields.titlePlaceholder")}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-desc">{t("form.fields.description")}</Label>
            <Textarea
              id="task-desc"
              placeholder={t("form.fields.descriptionPlaceholder")}
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="resize-none min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-due">{t("form.fields.dueDate")}</Label>
              <Input
                id="task-due"
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignee">{t("form.fields.assignee")}</Label>
              <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectTechnician")} />
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
              {tc("cancel")}
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim() || createMutation.isPending}
              className="h-10 px-4 bg-blue-600 hover:bg-blue-700"
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("form.actions.create")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
