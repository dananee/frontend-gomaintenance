"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRoles } from "@/hooks/useRoles";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreateRoleDialogProps {
    open: boolean;
    onClose: () => void;
}

export function CreateRoleDialog({ open, onClose }: CreateRoleDialogProps) {
    const { createRole, isCreating } = useRoles();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const t = useTranslations("settings.roles.form");
    const tCommon = useTranslations("settings.roles");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRole({ name, description });
            setName("");
            setDescription("");
            onClose();
        } catch (error) {
            // Error handling is likely in the hook via toast
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{tCommon("createRole")}</DialogTitle>
                    <DialogDescription>
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t("name")}</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Supervisor"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t("description")}</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating || !name}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("create")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
