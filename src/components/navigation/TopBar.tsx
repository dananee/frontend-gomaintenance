"use client";

import { Menu, HelpCircle } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationMenu } from "./NotificationMenu";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { toggle, toggleMobile } = useSidebarStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200/60 bg-white/95 px-4 backdrop-blur-xl transition-all dark:border-gray-800/60 dark:bg-[#0F1623]/95 lg:px-6 shadow-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 pointer-events-none" />

      {/* Left side */}
      <div className="relative flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobile}
          className="rounded-xl p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 hover:shadow-md dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop toggle button */}
        <button
          onClick={toggle}
          className="hidden rounded-xl p-2.5 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 hover:shadow-md dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 lg:block"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center Search - Enhanced */}
      <div className="relative mx-4 hidden flex-1 lg:block max-w-2xl">
        <div className="relative">
          <GlobalSearch />
          {/* Subtle glow under search */}
          <div className="absolute -bottom-2 left-1/2 h-8 w-3/4 -translate-x-1/2 bg-blue-500/10 blur-2xl" />
        </div>
      </div>

      {/* Right side - Enhanced */}
      <div className="relative flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Help Button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-md dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
            title="Help & Documentation"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <ThemeToggle />
          <NotificationMenu />
        </div>

        <div className="h-8 w-[1px] bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-700" />

        <UserNav />
      </div>
    </header>
  );
}
