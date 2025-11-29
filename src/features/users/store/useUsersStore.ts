import { create } from "zustand";
import { Role } from "@/lib/rbac/permissions";

export type UserStatus = "active" | "inactive";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
}

interface UsersState {
  users: UserRecord[];
  addUser: (user: Omit<UserRecord, "id">) => UserRecord;
}

const initialUsers: UserRecord[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "admin", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "supervisor", status: "active" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "mechanic", status: "active" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", role: "driver", status: "inactive" },
];

export const useUsersStore = create<UsersState>((set, get) => ({
  users: initialUsers,
  addUser: (user) => {
    const newUser: UserRecord = {
      ...user,
      id: crypto.randomUUID(),
    };
    set({ users: [newUser, ...get().users] });
    return newUser;
  },
}));
