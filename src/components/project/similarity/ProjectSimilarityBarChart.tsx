import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ProjectSimilarityData = {
  projectA: string;
  projectB: string;
  similarity: number;
};

interface ProjectSimilarityBarChartProps {
  data: ProjectSimilarityData[];
}

export function ProjectSimilarityBarChart({ data }: ProjectSimilarityBarChartProps) {
  const chartData = data.map(c => ({
    name: `${c.projectA} vs ${c.projectB}`,
    similarity: c.similarity,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Similarité entre Projets</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="similarity" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}