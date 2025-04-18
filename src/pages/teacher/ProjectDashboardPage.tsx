import DashboardLayout from "@/layout/dashboard.layout";
import { useProject } from "@/hooks/api/useProject";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import Divider from "@/components/layout/Divider";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import SummaryOverviewSection from "@/components/project/SummaryOverviewSection";
import SummaryGradesChartSection from "@/components/project/SummaryGradesChartSection";
import SummaryGradesStatsSection from "@/components/project/SummaryGradesStatsSection";
import { Link, useParams } from "react-router-dom";
import { FlexibleCardSkeleton } from "@/components/template/skeleton/FlexibleCardSkeleton";
import { Button } from "@/components/ui/button";

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProject(id || "");

  if (loading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Divider text="Résumé du projet" className="mt-0" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {project && (
          <ProjectSummaryCard
            project={project}
            btn={
              <Link to={`/gestion-projets/${project.id}/editer`}>
                <Button className="cursor-pointer">Modifier</Button>
              </Link>
            }
          />
        )}
      </div>

      <Divider text="Plagiat" className="mt-0" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FlexibleCardSkeleton />
        <FlexibleCardSkeleton />
        <FlexibleCardSkeleton />
      </div>

      <Divider text="Groupes" className="mt-0" />
      <SummaryOverviewSection project={project} />

      <Divider text="Notes" className="mt-0" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryGradesChartSection />
        <div className="flex flex-col gap-4">
          <SummaryGradesStatsSection
            median={11}
            average={10.5}
            max={20}
            min={0}
          />
          <FlexibleCardSkeleton />
        </div>
      </div>

      {/* 
      {tab === "groups" && (
        <>
          <Divider text="Groupes" />
          <ProjectGroupsManager
            mode={groupMode}
            setMode={setGroupMode}
            minSize={minSize}
            maxSize={maxSize}
            setMinSize={setMinSize}
            setMaxSize={setMaxSize}
            deadline={deadline}
            setDeadline={setDeadline}
          />
          <Divider text="Gérer" />
          <GroupBuilder
            mode={groupMode}
            minSize={minSize}
            maxSize={maxSize}
            deadline={deadline}
          />
        </>
      )} */}

      {/*       {tab === "rapports" && (
        <>
          <NavReport
            projectId={String(id)}
            onSelect={(report: SetStateAction<Report | null>) => setSelectedRapport(report)} />
          <Divider
            text={`Rapport ${selectedRapport ? "" : "Chargement..."}`}
            className="mt-0"
          />

          {selectedRapport ? (
            <TextEditor rapportId={selectedRapport.id} />
          ) : (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Aucun rapport disponible pour ce projet.
            </div>
          )}
        </>
      )} */}
    </DashboardLayout>
  );
}
