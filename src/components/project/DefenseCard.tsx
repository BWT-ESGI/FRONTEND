import FlexibleCard from "@/components/template/FlexibleCard";

export interface DefenseCardProps {
  defense: {
    start?: string;
    end?: string;
  } | null;
  loading: boolean;
  formattedDuration: string;
}

export default function DefenseCard({
  defense,
  loading,
  formattedDuration,
}: DefenseCardProps) {
  return (
    <FlexibleCard
      title="Soutenance"
     /*  childrenRightEnd={
        <Button variant="ghost" className="text-gray-500">
          <Download className="h-4 w-4" />
        </Button>
      } */
    >
      <div className="flex flex-col items-center justify-center h-full">
        {loading ? (
          <p className="text-gray-500">Chargement de la soutenance…</p>
        ) : defense?.start ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold">
              {new Date(defense.start).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              à{" "}
              {new Date(defense.start).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <span className="text-gray-500">Durée : {formattedDuration}</span>
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-500">
            Date de soutenance non définie
          </p>
        )}
      </div>
    </FlexibleCard>
  );
}
