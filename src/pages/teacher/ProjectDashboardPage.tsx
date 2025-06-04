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
import FlexibleCard from "@/components/template/FlexibleCard";
import { Presentation, SearchCheck } from "lucide-react";

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

  console.log("project", project);  
  return (
    <DashboardLayout>
      <Divider text="Résumé du projet" className="mt-0" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {project && (
          <>
            <div className="col-span-2">
              <ProjectSummaryCard
                project={project}
                btn={
                  <Link to={`/projets/${project.id}/editer`}>
                    <Button className="cursor-pointer">Modifier</Button>
                  </Link>
                }
              />
            </div>

            <div className="flex flex-col gap-4 h-full">
              <Link
                to={`/projets/${project.id}/projets/correction`}
                style={{ textDecoration: "none", height: "100%" }}
                className="h-full"
              >
                <FlexibleCard
                  className="relative flex flex-1 flex-col gap-4 cursor-pointer shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 hover:bg-blue-100 dark:hover:bg-blue-800/40 h-full justify-center items-center rounded-xl p-6 overflow-hidden"
                  title="Correction des groupes"
                  description=""
                >
                  <div className="flex flex-col items-start justify-center h-full w-full relative z-10 pl-16">
                    <p className="text-center text-base text-muted-foreground max-w-xs mb-4 text-left">
                      Accédez à la correction des rendus, rapports et
                      statistiques de plagiat pour chaque groupe du projet.
                    </p>
                  </div>
                  <SearchCheck className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 h-40 w-40 opacity-30 z-0 pointer-events-none" />
                </FlexibleCard>
              </Link>
              <Link
                to={`/projets/${project.id}/soutenances/correction`}
                style={{ textDecoration: "none", height: "100%" }}
                className="h-full"
              >
                <FlexibleCard
                  className="relative flex flex-1 flex-col gap-4 cursor-pointer shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 hover:bg-green-100 dark:hover:bg-green-800/40 h-full justify-center items-center rounded-xl p-6 overflow-hidden"
                  title="Soutenances"
                  description=""
                >
                  <div className="flex flex-col items-start justify-center h-full w-full relative z-10 pl-16">
                    <p className="text-center text-base text-muted-foreground max-w-xs mb-4 text-left">
                      Évaluez les soutenances des groupes pour ce projet.
                    </p>
                  </div>
                  <Presentation className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 h-40 w-40 opacity-30 z-0 pointer-events-none" />
                </FlexibleCard>
              </Link>
            </div>
          </>
        )}
      </div>

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

      <div className="w-full flex flex-col gap-6">
        <ProjectStatsCard
          total={projectSimilarityData.totalProjects}
          average={projectSimilarityData.averageProjectSimilarity}
        />
        <ProjectSimilarityBarChart
          data={projectSimilarityData.projectComparisons}
        />
        <ProjectFileSimilarityHeatmap data={projectSimilarityData} />
      </div>
    </DashboardLayout>
  );
}
