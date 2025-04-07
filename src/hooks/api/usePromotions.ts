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
              name: "Project Alpha",
              description: "A project about alpha testing.",
              promotionId: 101,
              nbStudensMinPerGroup: 3,
              nbStudentsMaxPerGroup: 5,
              nbGroups: 4,
              groupCompositionType: "manual",
              status: "draft",
              groups: [],
              createdAt: new Date("2023-01-01"),
              updatedAt: new Date("2023-01-15"),
            },
            {
              id: 2,
              name: "Project Beta",
              description: "A project about beta testing.",
              promotionId: 102,
              nbStudensMinPerGroup: 2,
              nbStudentsMaxPerGroup: 6,
              nbGroups: 3,
              groupCompositionType: "random",
              status: "published",
              groups: [],
              createdAt: new Date("2023-02-01"),
              updatedAt: new Date("2023-02-15"),
            },
            {
              id: 3,
              name: "Project Gamma",
              description: "A project about gamma testing.",
              promotionId: 103,
              nbStudensMinPerGroup: 4,
              nbStudentsMaxPerGroup: 8,
              nbGroups: 5,
              groupCompositionType: "student_choice",
              status: "archived",
              groups: [],
              createdAt: new Date("2023-03-01"),
              updatedAt: new Date("2023-03-15"),
            },
            {
              id: 4,
              name: "Project Delta",
              description: "A project about delta testing.",
              promotionId: 104,
              nbStudensMinPerGroup: 3,
              nbStudentsMaxPerGroup: 7,
              nbGroups: 6,
              groupCompositionType: "manual",
              status: "draft",
              groups: [],
              createdAt: new Date("2023-04-01"),
              updatedAt: new Date("2023-04-15"),
            },
            {
              id: 5,
              name: "Project Epsilon",
              description: "A project about epsilon testing.",
              promotionId: 105,
              nbStudensMinPerGroup: 2,
              nbStudentsMaxPerGroup: 4,
              nbGroups: 2,
              groupCompositionType: "random",
              status: "published",
              groups: [],
              createdAt: new Date("2023-05-01"),
              updatedAt: new Date("2023-05-15"),
            },
            {
              id: 6,
              name: "Project Zeta",
              description: "A project about zeta testing.",
              promotionId: 106,
              nbStudensMinPerGroup: 5,
              nbStudentsMaxPerGroup: 10,
              nbGroups: 8,
              groupCompositionType: "student_choice",
              status: "archived",
              groups: [],
              createdAt: new Date("2023-06-01"),
              updatedAt: new Date("2023-06-15"),
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
