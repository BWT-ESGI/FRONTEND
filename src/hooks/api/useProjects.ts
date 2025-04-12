// src/hooks/api/useProjects.ts
import { useEffect, useState } from "react";
import { Project } from "@/types/project.type";
import { fetchAllProjects } from "@/services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllProjects();
        setProjects(data);
      } catch (err) {
        console.error("Erreur lors du chargement des projets :", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { projects, loading };
}