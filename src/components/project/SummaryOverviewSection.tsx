import FlexibleCard from "@/components/template/FlexibleCard";
import { FlexibleCircularProgress } from "@/components/template/FlexibleCircularProgress";

export default function SummaryOverviewSection({ project }: { project: any }) {
  const total = 120;
  const late = 30;
  const onTime = total - late;

  const onTimePercentage = (onTime / total) * 100;
  const latePercentage = (late / total) * 100;

  const groupsCount = 9;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-8">
      <FlexibleCard title="Statistiques des groupes">
        <div className="flex flex-col items-center justify-center h-full">
          <FlexibleCircularProgress
            value={(groupsCount / project.nbGroups) * 100}
            size={100}
            className="stroke-purple-500/25"
            progressClassName="stroke-purple-600"
          />
          <p className="mt-2 text-lg font-bold">
            {groupsCount} groupe{groupsCount > 1 ? "s" : ""} sur{" "}
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
  );
}