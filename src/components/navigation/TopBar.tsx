"use client";

import { Menu, User } from "lucide-react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsPanel } from "./NotificationsPanel";

export function TopBar() {
  const { toggle, toggleMobile } = useSidebarStore();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleMobile}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop toggle button */}
        <button
          onClick={toggle}
          className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:block"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <GlobalSearch className="mx-4 hidden flex-1 lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <NotificationsPanel />

        {/* User menu */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role || "Role"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
              {user?.name ? getInitials(user.name) : <User className="h-5 w-5" />}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:inline-flex"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
