import { useState, useEffect } from "react";
import { Project } from "@/types/project.type";
import api from "@/config/axios";

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get<Project>(`/projects/${projectId}`);
        setProject(data);
      } catch (error) {
        console.error("Erreur lors du chargement du projet :", error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return { project, loading };
}