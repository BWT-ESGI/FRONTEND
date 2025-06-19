import DashboardLayout from "@/layout/dashboard.layout";
import { useProject } from "@/hooks/api/useProject";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import Divider from "@/components/layout/Divider";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";
import SummaryOverviewSection from "@/components/project/SummaryOverviewSection";
import SummaryGradesChartSection from "@/components/project/SummaryGradesChartSection";
import SummaryGradesStatsSection from "@/components/project/SummaryGradesStatsSection";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProjectStatsCard } from "@/components/project/similarity/ProjectStatsCard";
import { ProjectSimilarityBarChart } from "@/components/project/similarity/ProjectSimilarityBarChart";
import { ProjectFileSimilarityHeatmap } from "@/components/project/similarity/ProjectFileSimilarityHeatmap";
import FlexibleCard from "@/components/template/FlexibleCard";
import { Presentation, SearchCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProjectStats } from "@/services/projectStatsService";
import GradesPieChartSection from "@/components/project/GradesPieChartSection";
import { AdvancedStatsCard } from "@/components/AdvancedStatsCard";
import { TypeAveragesCard } from "@/components/project/TypeAveragesCard";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-muted/60 dark:bg-muted/30 rounded-lg shadow-sm hover:bg-muted/80 transition-colors border border-muted-foreground/10 mb-2"
        style={{ fontWeight: 600, fontSize: "1.1rem" }}
      >
        <span>{title}</span>
        <span>{open ? <ChevronDown /> : <ChevronRight />}</span>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {open && <div className="pt-2">{children}</div>}
      </div>
    </div>
  );
}

export default function ProjectDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading } = useProject(id || "");
  const [stats, setStats] = useState<any>(null);
  const [, setStatsLoading] = useState(true);
  const [showRendus, setShowRendus] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [showPlagiat, setShowPlagiat] = useState(true);

  useEffect(() => {
    if (id) {
      setStatsLoading(true);
      fetchProjectStats(id)
        .then((data) => {
          setStats(data);
        })
        .finally(() => setStatsLoading(false));
    }
  }, [id]);

  const projectSimilarityData = {
    totalProjects: 3,
    averageProjectSimilarity: 74.45,
    projectComparisons: [
      { projectA: "groupeA", projectB: "groupeB", similarity: 66.79 },
      { projectA: "groupeA", projectB: "groupeC", similarity: 75.95 },
      { projectA: "groupeB", projectB: "groupeC", similarity: 80.6 },
    ],
    fileComparisons: [
      {
        projectA: "groupeA",
        projectB: "groupeB",
        fileA: "groupeA/diff.js",
        fileB: "groupeB/fileUtils.js",
        similarity: 0,
      },
      {
        projectA: "groupeA",
        projectB: "groupeB",
        fileA: "groupeA/diff.js",
        fileB: "groupeB/index.js",
        similarity: 76.92,
      },
      {
        projectA: "groupeA",
        projectB: "groupeB",
        fileA: "groupeA/index.js",
        fileB: "groupeB/fileUtils.js",
        similarity: 0,
      },
      {
        projectA: "groupeA",
        projectB: "groupeB",
        fileA: "groupeA/index.js",
        fileB: "groupeB/index.js",
        similarity: 100,
      },
      {
        projectA: "groupeA",
        projectB: "groupeC",
        fileA: "groupeA/diff.js",
        fileB: "groupeC/fileUtils.js",
        similarity: 0,
      },
      {
        projectA: "groupeA",
        projectB: "groupeC",
        fileA: "groupeA/diff.js",
        fileB: "groupeC/index.js",
        similarity: 74.75,
      },
      {
        projectA: "groupeA",
        projectB: "groupeC",
        fileA: "groupeA/index.js",
        fileB: "groupeC/fileUtils.js",
        similarity: 0,
      },
      {
        projectA: "groupeA",
        projectB: "groupeC",
        fileA: "groupeA/index.js",
        fileB: "groupeC/index.js",
        similarity: 96.26,
      },
      {
        projectA: "groupeB",
        projectB: "groupeC",
        fileA: "groupeB/fileUtils.js",
        fileB: "groupeC/fileUtils.js",
        similarity: 44.44,
      },
      {
        projectA: "groupeB",
        projectB: "groupeC",
        fileA: "groupeB/fileUtils.js",
        fileB: "groupeC/index.js",
        similarity: 0,
      },
      {
        projectA: "groupeB",
        projectB: "groupeC",
        fileA: "groupeB/index.js",
        fileB: "groupeC/fileUtils.js",
        similarity: 0,
      },
      {
        projectA: "groupeB",
        projectB: "groupeC",
        fileA: "groupeB/index.js",
        fileB: "groupeC/index.js",
        similarity: 96.26,
      },
    ],
  };

  if (loading) return <FallBackPageSkeleton />;
  return (
    <DashboardLayout>
      <Divider text="Résumé du projet" className="mt-0" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      <CollapsibleSection
        title="Rendus"
        open={showRendus}
        onToggle={() => setShowRendus((v) => !v)}
      >
        <SummaryOverviewSection stats={stats} />
      </CollapsibleSection>
      
      <CollapsibleSection
        title="Notes"
        open={showNotes}
        onToggle={() => setShowNotes((v) => !v)}
      >
        <TypeAveragesCard stats={stats?.grades || {}} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryGradesChartSection
            groupGrades={stats?.grades.groupGrades || []}
            average={stats?.grades.average}
            median={stats?.grades.median}
          />
          <div className="flex flex-col gap-4 h-full">
            <SummaryGradesStatsSection
              median={stats?.grades.median}
              average={stats?.grades.average}
              max={stats?.grades.max}
              min={stats?.grades.min}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <GradesPieChartSection
            grades={(stats?.grades.groupGrades || []).map(
              (g: any) => g.globalGrade
            )}
          />
          <div className="col-span-2">
            <AdvancedStatsCard stats={stats?.grades || {}} />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Plagiat"
        open={showPlagiat}
        onToggle={() => setShowPlagiat((v) => !v)}
      >
        <div className="w-full flex flex-col gap-4">
          <ProjectStatsCard
            total={projectSimilarityData.totalProjects}
            average={projectSimilarityData.averageProjectSimilarity}
          />
          <ProjectSimilarityBarChart
            data={projectSimilarityData.projectComparisons}
          />
          <ProjectFileSimilarityHeatmap data={projectSimilarityData} />
        </div>
      </CollapsibleSection>
    </DashboardLayout>
  );
}
