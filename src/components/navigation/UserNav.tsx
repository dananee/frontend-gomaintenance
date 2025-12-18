"use client";

import { User, LogOut, Settings, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { useRouter } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-3 rounded-full p-1 pl-2 transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50 outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wider">
              {user?.role || "Role"}
            </p>
          </div>

          <div className="relative">
            <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800 shadow-sm transition-transform group-hover:scale-105">
              {user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium text-xs">
                {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-900 bg-green-500" />
          </div>

          <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl border-gray-200 dark:border-gray-800 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-base text-gray-900 dark:text-gray-50">
              {user?.name || "User"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              {user?.email || "user@example.com"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />
        <div className="space-y-1">
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/profile")}
            className="rounded-lg p-2.5 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/10 focus:text-blue-600 dark:focus:text-blue-400"
          >
            <UserCircle className="mr-3 h-4 w-4 text-gray-500 group-hover:text-blue-500" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="rounded-lg p-2.5 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/10 focus:text-blue-600 dark:focus:text-blue-400"
          >
            <Settings className="mr-3 h-4 w-4 text-gray-500 group-hover:text-blue-500" />
            Settings
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="my-1 bg-gray-100 dark:bg-gray-800" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-lg p-2.5 cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
