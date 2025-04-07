import { useState, useEffect } from "react";
import { Project } from "@/types/project.type";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockProjects: Project[] = [
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
      ];
      setProjects(mockProjects);
      setLoading(false);
    }, 500);
  }, []);

  return { projects, loading };
}
