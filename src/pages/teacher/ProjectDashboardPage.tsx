import DashboardLayout from "@/layout/dashboard.layout";
import { FlexibleCircularProgress } from "@/components/template/FlexibleCircularProgress";
import FlexibleCard from "@/components/template/FlexibleCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ComposedChart, Line, Scatter, CartesianGrid, YAxis } from "recharts";
import { useProject } from "@/hooks/api/useProject";
import ProjectSummaryCard from "@/components/project/ProjectSummaryCard";
import Divider from "@/components/layout/Divider";
import { ChevronDown, ChevronUp } from "lucide-react";
import FallBackPageSkeleton from "../global/FallBackPageSkeleton";

export default function ProjectDashboardPage() {
  const { project, loading } = useProject();

  const totalSubmissions = 120;
  const lateSubmissions = 30;
  const onTimeSubmissions = totalSubmissions - lateSubmissions;

  const onTimePercentage = (onTimeSubmissions / totalSubmissions) * 100;
  const latePercentage = (lateSubmissions / totalSubmissions) * 100;

  const groups = [
    { name: "Groupe A", submissions: 10, late: 2, averageGrade: 5 },
    { name: "Groupe B", submissions: 15, late: 5, averageGrade: 20 },
    { name: "Groupe C", submissions: 12, late: 3, averageGrade: 7 },
    { name: "Groupe D", submissions: 8, late: 1, averageGrade: 15 },
    { name: "Groupe E", submissions: 20, late: 4, averageGrade: 10 },
    { name: "Groupe F", submissions: 18, late: 6, averageGrade: 3 },
    { name: "Groupe G", submissions: 14, late: 2, averageGrade: 20 },
    { name: "Groupe H", submissions: 11, late: 0, averageGrade: 8 },
    { name: "Groupe I", submissions: 13, late: 3, averageGrade: 18 },
  ];

  const groupGrades = groups.map((g) => g.averageGrade);
  const overallAverage =
    groupGrades.reduce((sum, grade) => sum + grade, 0) / groupGrades.length;
  const sortedGrades = [...groupGrades].sort((a, b) => a - b);
  let median;
  if (sortedGrades.length % 2 === 0) {
    median =
      (sortedGrades[sortedGrades.length / 2 - 1] +
        sortedGrades[sortedGrades.length / 2]) /
      2;
  } else {
    median = sortedGrades[Math.floor(sortedGrades.length / 2)];
  }

  const minGrade = Math.min(...groupGrades);
  const maxGrade = Math.max(...groupGrades);

  const chartData = groups.map((g) => ({
    group: g.name,
    average: g.averageGrade,
    overall: overallAverage,
    median: median,
  }));

  const chartConfig = {
    average: {
      label: "Note moyenne du groupe",
      color: "#3b82f6",
    },
    overall: {
      label: "Moyenne globale",
      color: "#22c55e",
    },
    median: {
      label: "Médiane",
      color: "#ef4444",
    },
  };

  if (loading) {
    return <FallBackPageSkeleton />;
  }

  return (
    <DashboardLayout>
      <Divider text="Résumé du projet" className="mt-0" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProjectSummaryCard project={project} btn={false} />

        <FlexibleCard title="Information supplémentaire">
          <span className="text-sm text-gray-500">TODO</span>
        </FlexibleCard>
      </div>

      <Divider text="Groupes" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FlexibleCard title="Statistiques des groupes">
          <div className="flex flex-col items-center justify-center h-full">
            <FlexibleCircularProgress
              value={(groups.length / project.nbGroups) * 100}
              size={100}
              className="stroke-purple-500/25"
              progressClassName="stroke-purple-600"
            />
            <p className="mt-2 text-lg font-bold">
              {groups.length} groupe{groups.length > 1 ? "s" : ""} sur{" "}
              {project.nbGroups} demandé{project.nbGroups > 1 ? "s" : ""}
            </p>
          </div>
        </FlexibleCard>
        <FlexibleCard title="Pourcentage de rendus">
          <div className="flex flex-row items-center justify-around">
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold">À temps</p>
              <FlexibleCircularProgress
                value={onTimePercentage}
                size={100}
                className="stroke-green-500/25"
                progressClassName="stroke-green-600"
              />
              <p className="mt-2 text-lg font-bold">
                {onTimePercentage.toFixed(0)}%
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold">En retard</p>
              <FlexibleCircularProgress
                value={latePercentage}
                size={100}
                className="stroke-red-500/25"
                progressClassName="stroke-red-600"
              />
              <p className="mt-2 text-lg font-bold">
                {latePercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </FlexibleCard>
      </div>

      <Divider text="Notes & Moyennes" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <FlexibleCard title="Notes moyennes par groupe">
            <ChartContainer config={chartConfig}>
              <ComposedChart data={chartData}>
                <CartesianGrid vertical={false} />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  domain={[0, 20]}
                  tickFormatter={(value) => `${value} / 20`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="overall"
                  stroke="var(--color-overall)"
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  dataKey="median"
                  stroke="var(--color-median)"
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Scatter dataKey="average" fill="var(--color-average)" />
              </ComposedChart>
            </ChartContainer>
          </FlexibleCard>
        </div>
        <div className="col-span-1 flex flex-col gap-8 h-full">
          <FlexibleCard
            title="Statistiques des notes"
            className="flex-1"
            childrenFooter={
              <div className="flex flex-row items-center justify-around h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-lg font-bold">Médiane</p>
                  <div className="flex items-center justify-center text-2xl text-yellow-600">
                    {median.toFixed(2)}{" "}
                    <span className="text-black dark:text-white">/ 20</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-lg font-bold">Note moyenne</p>
                  <div className="flex items-center justify-center text-2xl text-blue-600">
                    {overallAverage.toFixed(2)}{" "}
                    <span className="text-black dark:text-white">/ 20</span>
                  </div>
                </div>
              </div>
            }
          >
            <div className="flex flex-row items-center justify-around h-full">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-bold">Note minimale</p>
                <div className="flex items-center justify-center text-2xl text-red-600">
                  <ChevronDown /> {minGrade.toFixed(2)}{" "}
                  <span className="text-black dark:text-white">/ 20</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-bold">Note maximale</p>
                <div className="flex items-center justify-center text-2xl text-green-600">
                  <ChevronUp /> {maxGrade.toFixed(2)}{" "}
                  <span className="text-black dark:text-white">/ 20</span>
                </div>
              </div>
            </div>
          </FlexibleCard>
          <FlexibleCard title="Statistiques des rendus" className="flex-1">
            <div className="flex flex-row items-center justify-around h-full"></div>
          </FlexibleCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
