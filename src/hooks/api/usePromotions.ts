import { useState, useEffect } from "react";
import { Promotion } from "@/types/promotion.type";

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockPromotions: Promotion[] = [
        {
          id: 1,
          name: "Promotion 2025",
          teacher: {
            id: 1,
            name: "Prof. Dupont",
            email: "dupont@gmail.com",
            role: "teacher",
          },
          students: [
            {
              id: 1,
              name: "Student One",
              email: "studentone@gmail.com",
              role: "student",
            },
            {
              id: 2,
              name: "Student Two",
              email: "studenttwo@gmail.com",
              role: "student",
            },
          ],
          projects: [
            {
              id: 1,
              name: "Project One",
              description: "Description of Project One",
              promotionId: 1,
              groups: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 2,
              name: "Project Two",
              description: "Description of Project Two",
              promotionId: 1,
              groups: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: 2,
          name: "Promotion 2026",
          teacher: {
            id: 2,
            name: "Prof. Martin",
            email: "martin@gmail.com",
            role: "teacher",
          },
          students: [],
          projects: [],
        },
        {
          id: 3,
          name: "Promotion 2027",
          teacher: {
            id: 3,
            name: "Prof. Leroy",
            email: "leroy@gmail.com",
            role: "teacher",
          },
          students: [],
          projects: [],
        },
        {
          id: 4,
          name: "Promotion 2028",
          teacher: {
            id: 4,
            name: "Prof. Moreau",
            email: "moreau@gmail.com",
            role: "teacher",
          },
          students: [],
          projects: [],
        },
      ];
      setPromotions(mockPromotions);
      setLoading(false);
    }, 1000);
  }, []);

  return { promotions, loading };
}
