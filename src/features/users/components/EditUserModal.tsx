"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Role } from "@/lib/rbac/permissions";
import { useUsersStore, UserRecord, UserStatus } from "../store/useUsersStore";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { useTranslations } from "next-intl";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRecord;
}

const roles = ["admin", "manager", "technician", "viewer", "driver"] as const;

export function EditUserModal({
  open,
  onOpenChange,
  user,
}: EditUserModalProps) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");

  const { mutate: performUpdate, isPending: isUpdating } = useUpdateUser();
  const { data: departments } = useDepartments();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [role, setRole] = useState<Role>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [department, setDepartment] = useState(user.department || "");
  const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setRole(user.role);
      setStatus(user.status);
      setDepartment(user.department || "");
      setAvatar(user.avatar);
      setErrors({});
    }
  }, [open, user]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = t("form.errors.nameRequired");
    if (!email.trim()) nextErrors.email = t("form.errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = t("form.errors.validEmail");
    if (!role) nextErrors.role = t("form.errors.roleRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    performUpdate(
      {
        id: user.id,
        updates: {
          name,
          email,
          phone: phone || undefined,
          role,
          status,
          department,
          avatar,
        },
      },
      {
        onSuccess: () => {
          toast.success(tt("success.userUpdated"), {
            description: tt("success.userUpdatedDesc", { name }),
          });
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to update user");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{t("form.editTitle")}</DialogTitle>
            <DialogDescription>
              {t("form.editDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {avatar && <AvatarImage src={avatar} alt={name} />}
              <AvatarFallback>{getInitials(name || "User")}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {t("form.fields.profilePhoto")}
              </p>
              <Input type="file" accept="image/*" onChange={handleAvatar} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t("form.fields.name")} *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form.fields.namePlaceholder")}
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">{t("form.fields.email")} *</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.fields.emailPlaceholder")}
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-phone">{t("form.fields.phone")}</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("form.fields.phonePlaceholder")}
              disabled={isUpdating}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("form.fields.department")}</Label>
            <Select
              value={department}
              onValueChange={setDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("form.fields.selectDepartment")} />
              </SelectTrigger>
              <SelectContent>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.fields.role")} *</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((option) => (
                    <SelectItem
                      key={option}
                      value={option}
                      className="capitalize"
                    >
                      {t(`roles.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-xs text-red-500">{errors.role}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("form.fields.status")} *</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as UserStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("status.active")}</SelectItem>
                  <SelectItem value="inactive">{t("status.inactive")}</SelectItem>
                  <SelectItem value="suspended">{t("status.suspended")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? tc("loading") : t("form.actions.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
