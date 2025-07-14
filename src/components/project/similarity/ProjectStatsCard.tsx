import FlexibleCard from "../../template/FlexibleCard";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type ProjectStatsCardProps = {
  total: number;
  average: number;
  project: { id: string };
};

export function ProjectStatsCard({ total, average, project }: ProjectStatsCardProps) {
  return (
    <FlexibleCard
      title="Statistiques des Projets"
      className="w-full"
      childrenRightEnd={
        <Button
        onClick={async () => {
          await import("@/services/projectComparisonService").then(({ triggerProjectComparison }) =>
            triggerProjectComparison(project.id)
          );
          toast.success("Comparaison lancée avec succès !");
        }}
      >
        Lancer une comparaison
      </Button>
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
      <div className="flex justify-center mt-4">

      </div>
    </FlexibleCard>
  );
}