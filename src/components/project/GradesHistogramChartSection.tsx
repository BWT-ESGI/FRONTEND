import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import FlexibleCard from "@/components/template/FlexibleCard";

const GRADE_BINS = [
  { min: 0, max: 4 },
  { min: 5, max: 9 },
  { min: 10, max: 14 },
  { min: 15, max: 20 },
];

function getHistogramData(grades: number[]) {
  return GRADE_BINS.map(({ min, max }) => ({
    range: `${min}–${max}`,
    count: grades.filter((g) => g !== null && g >= min && g <= max).length,
  }));
}

export default function GradesHistogramChartSection({ grades }: { grades: (number | null)[] }) {
  const data = getHistogramData(grades.filter((g): g is number => typeof g === "number"));
  return (
    <FlexibleCard title="Distribution des notes (histogramme)">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </FlexibleCard>
  );
}
