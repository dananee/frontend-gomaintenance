import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRole } from "@/hooks/useRoles";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

interface PermissionsDrawerProps {
    roleName: string | null;
    open: boolean;
    onClose: () => void;
}

const MODULES = [
    "users",
    "vehicles",
    "work_orders",
    "inventory",
    "maintenance",
    "reports",
    "settings",
];

const PERMISSION_TYPES = ["read", "create", "update", "delete"];

// Initial empty state for permissions
const INITIAL_PERMISSIONS: Record<string, string[]> = MODULES.reduce((acc, module) => {
    acc[module] = [];
    return acc;
}, {} as Record<string, string[]>);

export function PermissionsDrawer({ roleName, open, onClose }: PermissionsDrawerProps) {
    const { role, isLoading, updatePermissions, isUpdating } = useRole(roleName || "");
    const [permissions, setPermissions] = useState<Record<string, string[]>>(INITIAL_PERMISSIONS);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (role && role.permissions) {
            // Merge with initial to ensure all modules exist
            setPermissions({ ...INITIAL_PERMISSIONS, ...role.permissions });
            setHasChanges(false);
        }
    }, [role]);

    const handleToggle = (module: string, type: string, checked: boolean) => {
        setPermissions((prev) => {
            const modulePerms = prev[module] || [];
            let newModulePerms;

            if (checked) {
                newModulePerms = [...modulePerms, type];
            } else {
                newModulePerms = modulePerms.filter((p) => p !== type);
            }

            return {
                ...prev,
                [module]: newModulePerms,
            };
        });
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (roleName) {
            await updatePermissions(permissions);
            setHasChanges(false);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val: boolean) => !val && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="capitalize">Edit {roleName} Permissions</DialogTitle>
                    <DialogDescription>
                        Configure granular access control for this role.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-6 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-8 pb-4">
                            {MODULES.map((module) => (
                                <div key={module} className="space-y-3">
                                    <h4 className="text-sm font-semibold capitalize flex items-center gap-2">
                                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs uppercase">
                                            {module.replace("_", " ")}
                                        </span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {PERMISSION_TYPES.map((type) => {
                                            const isChecked = permissions[module]?.includes(type);
                                            return (
                                                <div
                                                    key={`${module}-${type}`}
                                                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${isChecked ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-accent/50"
                                                        }`}
                                                >
                                                    <Label
                                                        htmlFor={`${module}-${type}`}
                                                        className="text-sm font-medium capitalize cursor-pointer flex-1"
                                                    >
                                                        {type}
                                                    </Label>
                                                    <Switch
                                                        id={`${module}-${type}`}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => handleToggle(module, type, checked)}
                                                        disabled={roleName === "admin"} // Prevent locking out admin
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                <div className="pt-4 border-t mt-auto flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isUpdating}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!hasChanges || isUpdating || roleName === "admin"}>
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Permissions
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
