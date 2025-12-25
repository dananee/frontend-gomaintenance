"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import apiClient from "@/lib/api/axiosClient";
import { useTranslations } from "next-intl";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const t = useTranslations("login.resetPassword");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(t("errors.invalid"));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t("errors.mismatch"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password,
      });
      setIsSuccess(true);
      toast.success(t("success"));
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      const msg = err.response?.data?.error || tc("errors.generic");
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{tc("success") || "Success!"}</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              {t("success")}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/login")}>
              {tc("login") || "Go to Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-500">GoMaintenance</span>
          </div>
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && !token ? (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm mb-6 border border-red-100 dark:border-red-900/30">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("fields.newPassword")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || !token}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("fields.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading || !token}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoading || !token}>
                {isLoading ? tc("loading") : t("actions.submit")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
