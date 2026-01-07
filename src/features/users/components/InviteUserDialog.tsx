"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role } from "@/lib/rbac/permissions";
import { useTranslations } from "next-intl";
import { inviteUser } from "../api/inviteUser";
import { useUsersStore } from "../store/useUsersStore";
import { useRoles } from "@/hooks/useRoles";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const tt = useTranslations("toasts");

  const { roles: fetchedRoles } = useRoles();

  const languages = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "ar", label: "العربية" },
  ];

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setEmail("");
    setRole("viewer");
    setLanguage("en");
    setErrors({});
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = t("form.errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = t("form.errors.validEmail");
    if (!role) nextErrors.role = t("form.errors.roleRequired");
    if (!language) nextErrors.language = t("form.errors.languageRequired");
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await inviteUser({ email, role, language });
      toast.success(t("toasts.invited"));
      resetForm();
      onOpenChange(false);
      // We don't manually add to store because useUsers hook will sync with backend
    } catch (error: any) {
      toast.error(error.response?.data?.error || tc("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{t("form.inviteTitle")}</DialogTitle>
            <DialogDescription>{t("form.inviteDescription")}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t("form.fields.email")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("form.fields.emailPlaceholder")}
                disabled={isLoading}
                required
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("form.fields.role")}</Label>
                <Select value={role} onValueChange={(value) => setRole(value as Role)} disabled={isLoading}>
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
                <Label>{t("form.fields.language") || tc("language")}</Label>
                <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.fields.selectLanguage") || tc("selectLanguage")} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && <p className="text-xs text-red-500">{errors.language}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
              {tc("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? tc("loading") : t("form.actions.invite")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
