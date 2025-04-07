import { useState, useEffect } from "react";
import { Promotion } from "@/types/promotion.type";

export function usePromotion(promotionId: string) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!promotionId) return;
    setTimeout(() => {
      const mockPromotion: Promotion = {
        id: promotionId,
        name: "Promotion 2025",
        teacher: {
          id: 1,
          name: "Prof. Dupont",
          email: "dupont@gmail.com",
          role: "teacher",
        },
        students: [
          { id: 2, name: "Alice Smith", email: "alice@example.com", role: "student" },
          { id: 3, name: "Bob Jones", email: "bob@example.com", role: "student" },
          { id: 4, name: "Carol Lee", email: "carol@example.com", role: "student" },
        ],
        projects: [
          {
            id: 1,
            name: "Project One",
            description: "Description of Project One",
            promotionId: Number(promotionId),
            groups: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: "Project Two",
            description: "Description of Project Two",
            promotionId: Number(promotionId),
            groups: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      };
      setPromotion(mockPromotion);
      setLoading(false);
    }, 1000);
  }, [promotionId]);

  return { promotion, loading };
}