import FlexibleCard from "@/components/template/FlexibleCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ComposedChart, Line, Scatter, CartesianGrid, YAxis } from "recharts";

export default function SummaryGradesChartSection() {
  const data = [
    { group: "A", average: 10, overall: 11, median: 12 },
    { group: "B", average: 15, overall: 11, median: 12 },
  ];

  const config = {
    average: { label: "Note moyenne du groupe", color: "#3b82f6" },
    overall: { label: "Moyenne globale", color: "#22c55e" },
    median: { label: "Médiane", color: "#ef4444" },
  };

  return (
    <div className="my-8 col-span-2">
      <FlexibleCard title="Notes moyennes par groupe">
        <ChartContainer config={config}>
          <ComposedChart data={data}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={[0, 20]}
              tickFormatter={(value) => `${value} / 20`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="overall"
              stroke="var(--color-overall)"
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              dataKey="median"
              stroke="var(--color-median)"
              strokeDasharray="5 5"
              dot={false}
            />
            <Scatter dataKey="average" fill="var(--color-average)" />
          </ComposedChart>
        </ChartContainer>
      </FlexibleCard>
    </div>
  );
}