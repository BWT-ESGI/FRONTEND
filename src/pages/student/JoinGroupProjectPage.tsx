import GroupBuilder from "@/components/group/ GroupBuilder";
import FlexibleCard from "@/components/template/FlexibleCard";
import DashboardLayout from "@/layout/dashboard.layout";
import FlexibleErrorPage from "../global/FlexibleErrorPage";
import { useParams } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";

export default function JoinGroupProjectPage() {
    const { id } = useParams<{ id: string }>();
    if (!id) {
    return <FlexibleErrorPage errorCode={404} errorMessage="Projet introuvable" userFriendlyMessage="Le projet que vous essayez de rejoindre n'existe pas ou a été supprimé." />;
    }
    return (
      <ProjectProvider projectId={id}>
        <DashboardLayout>
          <FlexibleCard title="">
            <GroupBuilder />
          </FlexibleCard>
        </DashboardLayout>
      </ProjectProvider>
    );
}
