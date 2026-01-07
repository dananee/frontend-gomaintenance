"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Role } from "@/lib/rbac/permissions";
import { useUsersStore, UserStatus } from "../store/useUsersStore";
import { useCreateUser } from "../hooks/useCreateUser";
import { useRoles } from "@/hooks/useRoles";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/getUsers";

import { checkUserExists } from "../api/checkUserExists";
import { getDepartments } from "@/features/departments/api/departmentApi";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}



export function AddUserDialog({ open, onOpenChange }: AddUserDialogProps) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");

  const { mutate: performCreate, isPending: isCreating } = useCreateUser();
  const { roles: fetchedRoles, isLoading: rolesLoading } = useRoles();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [status, setStatus] = useState<UserStatus>("active");
  const [avatar, setAvatar] = useState<string | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debouncedFirstName = useDebounce(firstName, 500);
  const debouncedLastName = useDebounce(lastName, 500);

  const { data: checkData } = useQuery({
    queryKey: ["users", "check-exists", debouncedFirstName, debouncedLastName],
    queryFn: () => checkUserExists({ first_name: debouncedFirstName, last_name: debouncedLastName }),
    enabled: debouncedFirstName.length >= 2 && debouncedLastName.length >= 2,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: getDepartments,
  });

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setRole("viewer");
    setStatus("active");
    setAvatar(undefined);
    setErrors({});
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!firstName.trim()) nextErrors.firstName = t("form.errors.firstNameRequired");
    if (!lastName.trim()) nextErrors.lastName = t("form.errors.lastNameRequired");
    // Email is optional now
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = t("form.errors.validEmail");
    // Phone is optional, department is optional
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

    performCreate(
      { first_name: firstName, last_name: lastName, email, phone, department, role, status: status as "active" | "inactive" },
      {
        onSuccess: (newUser) => {
          toast.success(tt("success.userAdded"), {
            description: tt("success.userAddedDesc", { name: newUser.first_name + " " + newUser.last_name }),
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.error || "Failed to create user");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{t("form.title")}</DialogTitle>
            <DialogDescription>{t("form.description")}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {avatar && <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} />}
              <AvatarFallback>{getInitials(`${firstName} ${lastName}` || "New User")}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p className="font-medium text-gray-900 dark:text-gray-100">{t("form.fields.profilePhoto")}</p>
              <Input type="file" accept="image/*" onChange={handleAvatar} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("form.fields.firstName")}</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("form.fields.firstNamePlaceholder")}
                  required
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("form.fields.lastName")}</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("form.fields.lastNamePlaceholder")}
                  required
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            {checkData && checkData.exists && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                <p className="font-semibold mb-1">User already exists:</p>
                <ul className="list-disc list-inside">
                  {checkData.users.map(u => (
                    <li key={u.id}>{u.first_name} {u.last_name} ({u.role})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("form.fields.phone")}</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("form.fields.phonePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">{t("form.fields.department")}</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.departmentPlaceholder")} />
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t("form.fields.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.fields.emailPlaceholder")}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.fields.role")}</Label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("form.fields.selectRole")} />
                </SelectTrigger>
                <SelectContent>
                  {fetchedRoles?.map((r) => (
                    <SelectItem key={r.role} value={r.role} className="capitalize">
                      {["admin", "manager", "technician", "viewer", "driver"].includes(r.role.toLowerCase())
                        ? t(`roles.${r.role.toLowerCase()}`)
                        : r.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span>{t("form.fields.status")}</span>
                <span className="text-xs text-gray-500">{status === "active" ? t("status.active") : t("status.inactive")}</span>
              </Label>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
                <span className="text-sm text-gray-700 dark:text-gray-200">{t("status.active")}</span>
                <Switch checked={status === "active"} onCheckedChange={(checked) => setStatus(checked ? "active" : "inactive")} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isCreating || (checkData?.exists ?? false)}>
              {isCreating ? tc("loading") : t("form.actions.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
