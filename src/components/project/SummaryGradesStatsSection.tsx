import FlexibleCard from "@/components/template/FlexibleCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SummaryGradesStatsSectionProps {
  median: number;
  average: number;
  min: number;
  max: number;
}

export default function SummaryGradesStatsSection({
  median,
  average,
  min,
  max,
}: SummaryGradesStatsSectionProps) {
  if (median === undefined || average === undefined || min === undefined || max === undefined) {
    return (
      <FlexibleCard
        title="Statistiques des notes"
        className="col-span-1 flex flex-col gap-8 my-8"
      >
        <div className="flex flex-row items-center justify-around h-full">
          <p className="text-lg font-bold">Aucune donnée disponible</p>
        </div>
      </FlexibleCard>
    )
}

  return (
      <FlexibleCard
        title="Statistiques des notes"
        className="col-span-1 flex flex-col gap-8 my-8"
        childrenFooter={
          <div className="flex flex-row items-center justify-around h-full">
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-bold">Médiane</p>
              <div className="flex items-center justify-center text-2xl text-yellow-600">
                {median.toFixed(2)}{" "}
                <span className="text-muted-foreground">/ 20</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-bold">Note moyenne</p>
              <div className="flex items-center justify-center text-2xl text-blue-600">
                {average.toFixed(2)}{" "}
                <span className="text-muted-foreground">/ 20</span>
              </div>
            </div>
          </div>
        }
      >
        <div className="flex flex-row items-center justify-around h-full">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-bold">Note minimale</p>
            <div className="flex items-center justify-center text-2xl text-red-600">
              <ChevronDown /> {min.toFixed(2)}{" "}
              <span className="text-muted-foreground">/ 20</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-bold">Note maximale</p>
            <div className="flex items-center justify-center text-2xl text-green-600">
              <ChevronUp /> {max.toFixed(2)}{" "}
              <span className="text-muted-foreground">/ 20</span>
            </div>
          </div>
        </div>
      </FlexibleCard>
  );
}