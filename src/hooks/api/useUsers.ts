import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/user.type";
import { fetchAllUsers } from "@/services/userService";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des users :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, loading };
}
