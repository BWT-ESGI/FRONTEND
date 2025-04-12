// src/hooks/api/usePromotion.ts
import { useEffect, useState, useCallback } from "react";
import { fetchPromotionById } from "@/services/promotionService";
import { Promotion } from "@/types/promotion.type";

export function usePromotion(promotionId: string) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPromotionById(promotionId);
      setPromotion(data);
    } finally {
      setLoading(false);
    }
  }, [promotionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { promotion, loading, refetch: fetchData };
}