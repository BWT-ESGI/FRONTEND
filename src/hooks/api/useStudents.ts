import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/user.type";
import { fetchAllStudents } from "@/services/userService";

export function useStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des students :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { students, loading };
}
