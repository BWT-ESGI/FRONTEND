import { useState, useEffect } from "react";
import { User } from "@/types/user.type";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "Alice Dupont",
          email: "alice.dupont@bwt-school.com",
          role: "student",
        },
        { id: 2, name: "Bob Jones", email: "bob@example.com", role: "student" },
        {
          id: 3,
          name: "Carol Lee",
          email: "carol@example.com",
          role: "student",
        },
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  return { users, loading };
}
