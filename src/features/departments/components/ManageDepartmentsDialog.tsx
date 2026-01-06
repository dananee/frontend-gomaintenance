"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageSquarePlus, Pencil, Trash2, ArrowLeft, Plus } from "lucide-react";
import { useCreateDepartment, useUpdateDepartment, useDeleteDepartment, useDepartments } from "../hooks/useDepartments";
import { Department } from "../types/department";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ManageDepartmentsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ViewState = "LIST" | "CREATE" | "EDIT";

export function ManageDepartmentsDialog({ open, onOpenChange }: ManageDepartmentsDialogProps) {
    const t = useTranslations("departments"); // or common/users
    const tc = useTranslations("common");

    const [view, setView] = useState<ViewState>("LIST");
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

    const { data: departments, isLoading } = useDepartments();
    const createMutation = useCreateDepartment();
    const updateMutation = useUpdateDepartment();
    const deleteMutation = useDeleteDepartment();

    const isPending = createMutation.isPending || updateMutation.isPending;

    const resetForm = () => {
        setName("");
        setError("");
        setSelectedDept(null);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset state when closing
            setTimeout(() => {
                setView("LIST");
                resetForm();
            }, 300);
        }
        onOpenChange(newOpen);
    };

    const handleEdit = (dept: Department) => {
        setSelectedDept(dept);
        setName(dept.name);
        setView("EDIT");
    };

    const handleCreate = () => {
        resetForm();
        setView("CREATE");
    };

    const handleBack = () => {
        setView("LIST");
        resetForm();
    };

    const handleDelete = (dept: Department) => {
        setDeptToDelete(dept);
    };

    const confirmDelete = () => {
        if (deptToDelete) {
            deleteMutation.mutate(deptToDelete.id);
            setDeptToDelete(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        if (view === "EDIT" && selectedDept) {
            updateMutation.mutate(
                { id: selectedDept.id, data: { name } },
                {
                    onSuccess: () => {
                        toast.success("Department updated successfully");
                        handleBack();
                    },
                    onError: () => {
                        toast.error("Failed to update department");
                    },
                }
            );
        } else {
            createMutation.mutate(
                { name },
                {
                    onSuccess: () => {
                        toast.success("Department created successfully");
                        handleBack();
                    },
                    onError: () => {
                        toast.error("Failed to create department");
                    },
                }
            );
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            {view !== "LIST" && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2" onClick={handleBack}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            <DialogTitle>
                                {view === "LIST" && "Manage Departments"}
                                {view === "CREATE" && "New Department"}
                                {view === "EDIT" && "Edit Department"}
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            {view === "LIST" && "View and manage your organization's departments."}
                            {view === "CREATE" && "Create a new department."}
                            {view === "EDIT" && "Update department details."}
                        </DialogDescription>
                    </DialogHeader>

                    {view === "LIST" ? (
                        <div className="space-y-4">
                            <div className="flex justify-end">
                                <Button size="sm" onClick={handleCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Department
                                </Button>
                            </div>

                            <div className="min-h-[200px] max-h-[400px] overflow-y-auto space-y-2 border rounded-md p-2">
                                {isLoading ? (
                                    <div className="flex justify-center p-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                    </div>
                                ) : !departments?.length ? (
                                    <div className="text-center text-sm text-gray-500 py-8">
                                        No departments found.
                                    </div>
                                ) : (
                                    departments.map((dept) => (
                                        <div
                                            key={dept.id}
                                            className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                        >
                                            <span className="font-medium text-sm">{dept.name}</span>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                                                    onClick={() => handleEdit(dept)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-gray-500 hover:text-red-600"
                                                    onClick={() => handleDelete(dept)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="e.g. Engineering"
                                    autoFocus
                                />
                                {error && <p className="text-sm text-red-500">{error}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={handleBack}>
                                    {tc("cancel")}
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? tc("loading") : (view === "EDIT" ? tc("save") : tc("create"))}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deptToDelete} onOpenChange={() => setDeptToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the department "{deptToDelete?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={confirmDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
