import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import FlexibleCard from "@/components/template/FlexibleCard";

const COLORS = ["#ef4444", "#f59e42", "#3b82f6", "#22c55e"];
const LABELS = ["0–4", "5–9", "10–14", "15–20"];
const GRADE_BINS = [
  { min: 0, max: 4 },
  { min: 5, max: 9 },
  { min: 10, max: 14 },
  { min: 15, max: 20 },
];

function getPieData(grades: number[]) {
  return GRADE_BINS.map(({ min, max }, i) => ({
    name: LABELS[i],
    value: grades.filter((g) => g !== null && g >= min && g <= max).length,
  }));
}

export default function GradesPieChartSection({ grades }: { grades: (number | null)[] }) {
  const data = getPieData(grades.filter((g): g is number => typeof g === "number"));
  return (
    <FlexibleCard title="Répartition des notes (camembert)">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </FlexibleCard>
  );
}
