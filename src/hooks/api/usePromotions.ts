// src/hooks/api/usePromotions.ts
import { useCallback, useEffect, useState } from "react";
import { Promotion } from "@/types/promotion.type";
import { fetchPromotions } from "@/services/promotionService";

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des promotions :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { promotions, loading, refetch };
}