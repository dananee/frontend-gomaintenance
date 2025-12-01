"use client";

import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationMenu } from "./NotificationMenu";
import { UserNav } from "./UserNav";
import { ThemeToggle } from "@/components/theme-toggle";

export function TopBar() {
  const { toggle, toggleMobile } = useSidebarStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200/60 bg-white/80 px-4 backdrop-blur-xl transition-all dark:border-gray-800/60 dark:bg-[#0F1623]/80 lg:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobile}
          className="rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop toggle button */}
        <button
          onClick={toggle}
          className="hidden rounded-lg p-2 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 lg:block"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Center Search */}
      <div className="mx-4 hidden flex-1 lg:block max-w-xl">
        <GlobalSearch />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <NotificationMenu />
        </div>

        <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1" />

        <UserNav />
      </div>
    </header>
  );
}
