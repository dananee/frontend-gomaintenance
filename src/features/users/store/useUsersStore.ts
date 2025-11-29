import { create } from "zustand";
import { Role } from "@/lib/rbac/permissions";

export type UserStatus = "active" | "inactive" | "suspended";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  created_at?: string;
  last_active?: string;
}

interface UsersState {
  users: UserRecord[];
  addUser: (user: Omit<UserRecord, "id" | "created_at">) => UserRecord;
  updateUser: (id: string, updates: Partial<UserRecord>) => void;
  suspendUser: (id: string) => void;
  reactivateUser: (id: string) => void;
  deleteUser: (id: string) => void;
}

const initialUsers: UserRecord[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "technician",
    status: "active",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "viewer",
    status: "inactive",
  },
];

export const useUsersStore = create<UsersState>((set, get) => ({
  users: initialUsers,
  addUser: (user) => {
    const newUser: UserRecord = {
      ...user,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    set({ users: [newUser, ...get().users] });
    return newUser;
  },
  updateUser: (id, updates) => {
    set({
      users: get().users.map((user) =>
        user.id === id ? { ...user, ...updates } : user
      ),
    });
  },
  suspendUser: (id) => {
    set({
      users: get().users.map((user) =>
        user.id === id ? { ...user, status: "suspended" } : user
      ),
    });
  },
  reactivateUser: (id) => {
    set({
      users: get().users.map((user) =>
        user.id === id ? { ...user, status: "active" } : user
      ),
    });
  },
  deleteUser: (id) => {
    set({ users: get().users.filter((user) => user.id !== id) });
  },
}));
