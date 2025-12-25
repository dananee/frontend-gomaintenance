import { useQuery } from "@tanstack/react-query";
import { getUsers, GetUsersParams } from "../api/getUsers";
import { useUsersStore, UserRecord } from "../store/useUsersStore";
import { useEffect } from "react";

export function useUsers(params?: GetUsersParams) {
  const setUsers = useUsersStore((state) => state.setUsers);

  const query = useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sync API data with Zustand store, mapping User to UserRecord
  useEffect(() => {
    if (query.data?.data) {
      const mappedUsers: UserRecord[] = query.data.data.map(user => ({
        id: user.id,
        name: user.name || `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role,
        status: user.is_invited ? "pending" : (user.is_active !== false ? "active" : "inactive"),
        avatar: user.avatar,
        created_at: user.created_at,
        last_active: user.updated_at,
      }));
      setUsers(mappedUsers);
    }
  }, [query.data, setUsers]);

  return query;
}

