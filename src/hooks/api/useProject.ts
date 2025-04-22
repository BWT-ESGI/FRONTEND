import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types/project.type";
import api from "@/config/axios";

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Project>(`/projects/${projectId}`);
      setProject(data);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  return {
    project,
    loading,
    reload: fetchProject,
    setProject,
  } as const;
}
