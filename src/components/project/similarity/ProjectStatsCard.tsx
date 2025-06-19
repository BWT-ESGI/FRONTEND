import { Badge } from "@/components/ui/badge";
import FlexibleCard from "../../template/FlexibleCard";
import { TrendingUp, Layers } from "lucide-react";

type ProjectStatsCardProps = {
  total: number;
  average: number;
};

export function ProjectStatsCard({ total, average }: ProjectStatsCardProps) {
  return (
    <FlexibleCard
      title="Statistiques des Projets"
      className="w-full"
      childrenRightEnd={
        <div className="flex gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Layers className="w-4 h-4" />
            {total} projet{total > 1 ? "s" : ""}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {average.toFixed(2)}% moyenne
          </Badge>
        </div>
      }
      description="Synthèse globale de vos projets"
    >
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between py-2">
        <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
          <span className="text-4xl font-bold tracking-tight">{total}</span>
          <span className="text-muted-foreground">Nombre total de projets</span>
        </div>
        <div className="flex-1 flex flex-col gap-2 min-w-[180px]">
          <span className="text-4xl font-bold tracking-tight">{average.toFixed(2)}%</span>
          <span className="text-muted-foreground">Similarité moyenne</span>
        </div>
      </div>
    </FlexibleCard>
  );
}