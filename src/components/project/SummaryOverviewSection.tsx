import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, TimerReset } from "lucide-react";

const COLORS = [
  "#10B981",
  "#EF4444",
  "#3B82F6",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

export default function SummaryOverviewSection({ stats }: { stats: any }) {
  if (!stats) return null;

  const deliverableBreakdown = stats.deliverableBreakdown.map((d: any) => ({
    name: d.name,
    submissions: d.submissionCount,
    late: d.lateCount,
    lateRate: d.lateRate,
  }));

  const submissionTypes = [
    {
      name: "Archive",
      value: stats.submissionStats.submissionTypeCount.archive,
    },
    {
      name: "Fichier",
      value: stats.submissionStats.submissionTypeCount.fileUrl,
    },
    { name: "Git", value: stats.submissionStats.submissionTypeCount.gitRepo },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
      {/* Délai moyen de soumission et soumissions de dernière minute */}
      <Card className="col-span-1 xl:col-span-2">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-around">
          <div className="flex items-center gap-4">
            <TimerReset className="text-blue-500" size={48} />
            <div>
              <h4 className="text-xl font-bold">Délai moyen de soumission</h4>
              <p className="text-2xl">
                {stats.submissionTiming.averageSubmissionDelayHours?.toFixed(1)}{" "}
                h
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="hidden md:block h-24" />
          <div className="flex items-center gap-4">
            <CircleCheck className="text-yellow-500" size={48} />
            <div>
              <h4 className="text-xl font-bold">
                Soumissions juste avant la deadline
              </h4>
              <p className="text-2xl">
                {stats.submissionTiming.submissionsJustBeforeDeadline}{" "}
                soumission
                {stats.submissionTiming.submissionsJustBeforeDeadline !== 1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume de données et pénalités */}
      <Card className="col-span-1 xl:col-span-2">
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Taille moyenne fichier
            </p>
            <p className="text-3xl font-bold">
              {stats.submissionStats.averageFileSize} Mo
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Pénalité moyenne</p>
            <p className="text-3xl font-bold">
              {stats.submissionStats.averagePenalty} point
              {stats.submissionStats.averagePenalty !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Taux de rendus en retard
            </p>
            <p className="text-3xl font-bold">
              {stats.submissionStats.lateRate}%
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Soumissions par livrable */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Soumissions par livrable
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliverableBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="submissions" fill="#10B981" name="Soumissions" />
              <Bar dataKey="late" fill="#EF4444" name="En retard" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Types de soumissions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Répartition des types de soumission
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={submissionTypes}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
