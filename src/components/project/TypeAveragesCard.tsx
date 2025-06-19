import React from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, ClipboardCheck, FileText, BarChart2 } from "lucide-react";

interface TypeAveragesCardProps {
  stats?: {
    stdDev?: number;
    variance?: number;
    typeAverages?: {
      defense?: number;
      deliverable?: number;
      report?: number;
    };
  };
}

const METADATA: Record<string, { label: string; icon: React.ReactNode }> = {
  defense: {
    label: "Soutenance",
    icon: <Shield className="h-5 w-5 text-blue-500" />,
  },
  deliverable: {
    label: "Livrable",
    icon: <ClipboardCheck className="h-5 w-5 text-green-500" />,
  },
  report: {
    label: "Rapport",
    icon: <FileText className="h-5 w-5 text-purple-500" />,
  },
  variance: {
    label: "Variance",
    icon: <BarChart2 className="h-5 w-5 text-yellow-500" />,
  },
  stdDev: {
    label: "Écart-type",
    icon: <span className="inline-block text-xl font-semibold">σ</span>,
  },
};

export function TypeAveragesCard({ stats }: TypeAveragesCardProps) {
  const items: { key: string; value: number }[] = [];

  if (stats) {
    if (stats.typeAverages) {
      ["defense", "deliverable", "report"].forEach((key) => {
        const v = (stats.typeAverages as any)[key];
        if (typeof v === "number") items.push({ key, value: v });
      });
    }
    if (typeof stats.variance === "number")
      items.push({ key: "variance", value: stats.variance });
    if (typeof stats.stdDev === "number")
      items.push({ key: "stdDev", value: stats.stdDev });
  }

  return (
    <div className="w-full mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {["defense", "deliverable", "report", "variance", "stdDev"].map((key) => {
          const item = items.find((i) => i.key === key);
          const { label, icon } = METADATA[key];
          if (!item) {
            return (
              <div
                key={key}
                className="flex flex-col items-center bg-white rounded-2xl shadow p-4 min-h-[120px] justify-center"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  {icon}
                  <span className="font-medium">{label}</span>
                </div>
                <span className="text-muted-foreground text-center mt-2">Aucune donnée disponible</span>
              </div>
            );
          }
          const percent = Math.min(Math.max((item.value / 20) * 100, 0), 100);
          return (
            <div
              key={key}
              className="flex flex-col items-center bg-white rounded-2xl shadow p-4"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                {icon}
                <span className="font-medium">{label}</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {item.value.toFixed(2)}{" "}
                { ["defense", "deliverable", "report"].includes(key) && (
                  <span className="text-sm text-muted-foreground">/ 20</span>
                )}
              </div>
              <Progress className="w-full" value={percent} />
              <div className="text-xs text-muted-foreground mt-1">
                {percent.toFixed(0)} %
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
