import { useState, useEffect } from "react";
import { Project } from "@/types/project.type";

export function useProject() {
  const [project, setProject] = useState<Project>({} as Project);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockProject: Project = {
          id: 1,
          name: "Project Alpha",
          description: "A project about alpha testing.",
          promotionId: 101,
          nbStudensMinPerGroup: 3,
          nbStudentsMaxPerGroup: 5,
          nbGroups: 11,
          groupCompositionType: "manual",
          status: "published",
          groups: [],
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date("2023-01-15"),
        };
      setProject(mockProject);
      setLoading(false);
    }, 500);
  }, []);

  return { project, loading };
}
