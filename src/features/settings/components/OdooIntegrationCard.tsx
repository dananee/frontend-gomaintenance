"use client";

import { useOdooIntegration } from "@/hooks/useOdooIntegration";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, RefreshCw, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function OdooIntegrationCard() {
    const {
        status,
        isLoading,
        connect,
        isConnecting,
        disconnect,
        isDisconnecting,
        testConnection,
        isTesting
    } = useOdooIntegration();
    const t = useTranslations("settings.integrations.odoo");

    const [formData, setFormData] = useState({
        base_url: "",
        database: "",
        username: "",
        api_key: "",
    });

    if (isLoading) {
        return <div className="p-4 border rounded-lg"><Loader2 className="animate-spin" /></div>;
    }

    const isConnected = status?.is_connected;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await connect(formData);
    };

    return (
        <Card className={`border-l-4 ${isConnected ? "border-l-green-500" : "border-l-gray-300"}`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative h-12 w-12 bg-white rounded-lg border p-1">
                            <Image src="/logos/odoo.png" alt="Odoo" fill className="object-contain" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">{t("cardTitle")}</CardTitle>
                            <CardDescription>
                                {t("cardDescription")}
                            </CardDescription>
                        </div>
                    </div>
                    {isConnected && (
                        <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                            <CheckCircle className="mr-1.5 h-4 w-4" />
                            {t("status.connected")}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {isConnected ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 dark:bg-gray-900 p-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">{t("fields.baseUrl")}</Label>
                                <p className="text-sm font-medium">{status?.base_url}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">{t("fields.database")}</Label>
                                <p className="text-sm font-medium">{status?.database}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">{t("fields.lastSync")}</Label>
                                <p className="text-sm font-medium">{status?.last_sync_at ? new Date(status.last_sync_at).toLocaleString() : t("fields.never")}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">{t("fields.status")}</Label>
                                <p className="text-sm font-medium text-green-600">{t("status.active")}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form id="odoo-connect-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="base_url">{t("form.odooUrl")}</Label>
                                <Input
                                    id="base_url"
                                    placeholder="https://your-instance.odoo.com"
                                    value={formData.base_url}
                                    onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="database">{t("form.databaseName")}</Label>
                                <Input
                                    id="database"
                                    placeholder="odoo_db"
                                    value={formData.database}
                                    onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">{t("form.username")}</Label>
                                <Input
                                    id="username"
                                    placeholder="user@example.com"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="api_key">{t("form.apiKey")}</Label>
                                <Input
                                    id="api_key"
                                    type="password"
                                    placeholder="••••••••••••••••"
                                    value={formData.api_key}
                                    onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </form>
                )}
            </CardContent>

            <CardFooter className="flex justify-between bg-gray-50/50 dark:bg-gray-900/50 border-t p-4">
                {isConnected ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => testConnection()}
                            disabled={isTesting}
                        >
                            {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            {t("actions.testConnection")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => disconnect()}
                            disabled={isDisconnecting}
                        >
                            {isDisconnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            {t("actions.disconnect")}
                        </Button>
                    </>
                ) : (
                    <Button
                        className="ml-auto"
                        type="submit"
                        form="odoo-connect-form"
                        disabled={isConnecting}
                    >
                        {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        {t("actions.connect")}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
