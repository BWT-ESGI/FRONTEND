import { useState, useEffect, useCallback } from "react";
import { Defense } from "@/types/defense.type";
import { getDefenseByGroupId } from "@/services/defenseService";

export function useDefense(groupId: string) {
  const [defense, setDefense] = useState<Defense | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDefense = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDefenseByGroupId(groupId);
        if (data && Array.isArray(data) && data.length > 0) {
          setDefense(data[0]);
        } else {
          setDefense(null);
        }
    } catch {
      setDefense(null);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchDefense();
    }
  }, [groupId, fetchDefense]);

  return {
    defense,
    loading,
    reload: fetchDefense,
    setDefense,
  } as const;
}
