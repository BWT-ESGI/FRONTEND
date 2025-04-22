import { useParams } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import ProjectDashboardPage from "@/pages/teacher/ProjectDashboardPage";

export default function ProjectDashboardWrapper() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>Projet introuvable</div>;
  }
  return (
    <ProjectProvider projectId={id}>
      <ProjectDashboardPage />
    </ProjectProvider>
  );
}