import { useParams } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import ProjectEditPage from "@/pages/teacher/ProjectEditPage";
import NotFoundPage from "../global/NotFoundPage";

export default function ProjectEditWrapper() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <NotFoundPage />;

  return (
    <ProjectProvider projectId={id}>
      <ProjectEditPage />
    </ProjectProvider>
  );
}