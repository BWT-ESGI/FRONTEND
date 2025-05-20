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
import { ProjectStatsCard } from "@/components/project/similarity/ProjectStatsCard";
import { ProjectSimilarityBarChart } from "@/components/project/similarity/ProjectSimilarityBarChart";
import { ProjectFileSimilarityHeatmap } from "@/components/project/similarity/ProjectFileSimilarityHeatmap";

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProject(id || "");
  const projectSimilarityData = {
  totalProjects: 3,
  averageProjectSimilarity: 74.45,
  projectComparisons: [
    { projectA: "groupeA", projectB: "groupeB", similarity: 66.79 },
    { projectA: "groupeA", projectB: "groupeC", similarity: 75.95 },
    { projectA: "groupeB", projectB: "groupeC", similarity: 80.6 },
  ],
  fileComparisons: [
      { "projectA": "groupeA", "projectB": "groupeB", "fileA": "groupeA/diff.js", "fileB": "groupeB/fileUtils.js", "similarity": 0 },
      { "projectA": "groupeA", "projectB": "groupeB", "fileA": "groupeA/diff.js", "fileB": "groupeB/index.js", "similarity": 76.92 },
      { "projectA": "groupeA", "projectB": "groupeB", "fileA": "groupeA/index.js", "fileB": "groupeB/fileUtils.js", "similarity": 0 },
      { "projectA": "groupeA", "projectB": "groupeB", "fileA": "groupeA/index.js", "fileB": "groupeB/index.js", "similarity": 100 },
      { "projectA": "groupeA", "projectB": "groupeC", "fileA": "groupeA/diff.js", "fileB": "groupeC/fileUtils.js", "similarity": 0 },
      { "projectA": "groupeA", "projectB": "groupeC", "fileA": "groupeA/diff.js", "fileB": "groupeC/index.js", "similarity": 74.75 },
      { "projectA": "groupeA", "projectB": "groupeC", "fileA": "groupeA/index.js", "fileB": "groupeC/fileUtils.js", "similarity": 0 },
      { "projectA": "groupeA", "projectB": "groupeC", "fileA": "groupeA/index.js", "fileB": "groupeC/index.js", "similarity": 96.26 },
      { "projectA": "groupeB", "projectB": "groupeC", "fileA": "groupeB/fileUtils.js", "fileB": "groupeC/fileUtils.js", "similarity": 44.44 },
      { "projectA": "groupeB", "projectB": "groupeC", "fileA": "groupeB/fileUtils.js", "fileB": "groupeC/index.js", "similarity": 0 },
      { "projectA": "groupeB", "projectB": "groupeC", "fileA": "groupeB/index.js", "fileB": "groupeC/fileUtils.js", "similarity": 0 },
      { "projectA": "groupeB", "projectB": "groupeC", "fileA": "groupeB/index.js", "fileB": "groupeC/index.js", "similarity": 96.26 }
  ],
};

  if (loading) return <FallBackPageSkeleton />;

  return (
    <DashboardLayout>
      <Divider text="Résumé du projet" className="mt-0" />
        {project && (
          <ProjectSummaryCard
            project={project}
            btn={
              <Link to={`/projets/${project.id}/editer`}>
                <Button className="cursor-pointer">Modifier</Button>
              </Link>
            }
          />
        )}

      <Divider text="Groupes" className="mt-8" />
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

      <Divider text="Plagiat" className="mt-8" />
      
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
        <ProjectStatsCard total={projectSimilarityData.totalProjects} average={projectSimilarityData.averageProjectSimilarity} />
        <ProjectSimilarityBarChart data={projectSimilarityData.projectComparisons} />
        <ProjectFileSimilarityHeatmap data={projectSimilarityData} />
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
