"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/navigation/UserNav";
import { NotificationMenu } from "@/components/navigation/NotificationMenu";
import { Wrench } from "lucide-react";

export function TechnicianHeader() {
    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-4 dark:border-gray-800 dark:bg-gray-900/95">
            <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-600 p-2 text-white shadow-sm">
                    <Wrench className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                    GoMaintenance
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <NotificationMenu />
                </div>
                <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700" />
                <UserNav />
            </div>
        </header>
    );
}
