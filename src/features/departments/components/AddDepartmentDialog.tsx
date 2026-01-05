"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDepartment } from "../api/departmentApi";
import { useTranslations } from "next-intl";

interface AddDepartmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddDepartmentDialog({ open, onOpenChange }: AddDepartmentDialogProps) {
    const t = useTranslations("departments"); // Assuming a departments namespace, or we can use common/users
    const tc = useTranslations("common");

    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const { mutate: performCreate, isPending } = useMutation({
        mutationFn: createDepartment,
        onSuccess: () => {
            toast.success("Department created successfully");
            queryClient.invalidateQueries({ queryKey: ["departments"] }); // Invalidate departments list if exists
            setName("");
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to create department");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Name is required");
            return;
        }
        performCreate({ name });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Department</DialogTitle>
                    <DialogDescription>
                        Create a new department to organize users.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {tc("cancel")}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? tc("loading") : tc("create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
