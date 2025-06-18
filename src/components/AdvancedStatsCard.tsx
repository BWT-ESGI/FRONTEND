import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AdvancedStatsCardProps {
  stats?: {
    Q1?: number;
    Q3?: number;
    P90?: number;
    passRate?: number;
  };
}

export function AdvancedStatsCard({ stats }: AdvancedStatsCardProps) {
  const distributionData = [
    { name: "Q1", value: stats?.Q1 ?? 0 },
    { name: "Q3", value: stats?.Q3 ?? 0 },
    { name: "P90", value: stats?.P90 ?? 0 },
  ];

  const passRate = stats?.passRate ?? 0;
  const passData = [
    { name: "Réussite", value: passRate },
    { name: "Restant", value: 100 - passRate },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Données avancées : Dispersion & Quartiles</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Bar Chart */}
        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pass Rate Pie Chart as Gauge */}
        <div className="w-full h-52 flex items-center justify-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={passData}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                cornerRadius={10}
              >
                <Cell key="success" fill="#10b981" />
                <Cell key="remaining" fill="#e5e7eb" />
              </Pie>
              <Tooltip formatter={(value: number) => `${value.toFixed(0)}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-2xl font-semibold">{passRate}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
