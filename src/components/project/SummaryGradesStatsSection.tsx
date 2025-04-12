import FlexibleCard from "@/components/template/FlexibleCard";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SummaryGradesStatsSection() {
  const median = 12;
  const average = 13.5;
  const min = 5;
  const max = 19;

  return (
    <div className="col-span-1 flex flex-col gap-8 h-full my-8">
      <FlexibleCard
        title="Statistiques des notes"
        className="flex-1"
        childrenFooter={
          <div className="flex flex-row items-center justify-around h-full">
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-bold">Médiane</p>
              <div className="flex items-center justify-center text-2xl text-yellow-600">
                {median.toFixed(2)} <span className="text-muted-foreground">/ 20</span>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-bold">Note moyenne</p>
              <div className="flex items-center justify-center text-2xl text-blue-600">
                {average.toFixed(2)} <span className="text-muted-foreground">/ 20</span>
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
    </div>
  );
}