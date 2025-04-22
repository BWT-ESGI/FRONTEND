import React, { createContext, useContext } from "react";
import { useProject } from "@/hooks/api/useProject";
import { Project } from "@/types/project.type";

interface ProjectContextType {
  project: Project | null;
  loading: boolean;
  reload: () => void;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function useProjectContext(): ProjectContextType {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return ctx;
}

export function ProjectProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: React.ReactNode;
}) {
  const { project, loading, reload, setProject } = useProject(projectId);

  return (
    <ProjectContext.Provider value={{ project, loading, reload, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
}