import FlexibleCard from "@/components/template/FlexibleCard";
import Divider from "@/components/layout/Divider";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SummaryGradesStatsSectionProps {
  median: number;
  average: number;
  min: number;
  max: number;
  stdDev?: number;
  variance?: number;
  Q1?: number;
  Q3?: number;
  P90?: number;
  passRate?: number;
  typeAverages?: { defense?: number; deliverable?: number; report?: number };
}

export default function SummaryGradesStatsSection({
  median,
  average,
  min,
  max,
}: SummaryGradesStatsSectionProps) {
  const hasData = median !== undefined && median !== null &&
    average !== undefined && average !== null &&
    min !== undefined && min !== null &&
    max !== undefined && max !== null;

  const items = [
    { key: 'min', value: min, color: 'red' },
    { key: 'max', value: max, color: 'green' },
    { key: 'median', value: median, color: 'yellow' },
    { key: 'average', value: average, color: 'blue' },
  ];

  return (
      <div className="flex flex-col w-full h-full gap-4">
          {hasData ? (
            items.map(({ key, value }) => {
              return (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center border rounded-xl bg-white shadow h-26 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {key === 'min' && <ChevronDown className="text-red-600" />}
                    {key === 'max' && <ChevronUp className="text-green-600" />}
                    <span className="font-medium">{key === 'median' ? 'Médiane' : key === 'average' ? 'Note moyenne' : key === 'min' ? 'Note minimale' : 'Note maximale'}</span>
                  </div>
                  <div className={`text-2xl font-bold mb-2 text-${key === 'min' ? 'red' : key === 'max' ? 'green' : key === 'median' ? 'yellow' : 'blue'}-600`}>
                    {value.toFixed(2)} <span className="text-sm text-muted-foreground">/ 20</span>
                  </div>
                </div>
              );
            })
          ) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center h-32 border rounded-xl bg-muted">
                <p className="text-sm text-center">Aucune donnée disponible</p>
              </div>
            ))
          )}
      </div>
  );
}