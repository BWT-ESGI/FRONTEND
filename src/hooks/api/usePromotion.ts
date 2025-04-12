import { useState, useEffect } from "react";
import { Promotion } from "@/types/promotion.type";
import { fetchPromotion } from "@/services/promotionService";

export function usePromotion(promotionId: number) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPromotion = async () => {
      try {
        const data = await fetchPromotion(promotionId);
        setPromotion(data);
      } catch (error) {
        console.error("Erreur lors du chargement des promotions :", error);
      } finally {
        setLoading(false);
      }
    };

    loadPromotion();
  }, []);

  return { promotion, loading };
}