import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, LineChart, Line } from "recharts";
import FlexibleCard from "../template/FlexibleCard";
import FlexibleAlert from "../template/FlexibleAlert";
import { AlertCircle, CheckCircle, XCircle, Percent, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { fetchDeliverablesByProject } from "@/services/deliverableService";

export function RuleResultsStatsCard({ ruleResults, projectId }: { ruleResults: any[]; projectId: string }) {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  useEffect(() => {
    if (!projectId) return;
    fetchDeliverablesByProject(projectId).then(res => {
      setDeliverables(res.data);
    });
  }, [projectId]);
  if (!ruleResults || ruleResults.length === 0) {
    return <FlexibleAlert title="Aucun résultat de règle" icon={<AlertCircle />} />;
  }

  const total = ruleResults.length;
  const passed = ruleResults.filter(r => r.passed).length;
  const failed = total - passed;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  const pieData = [
    { name: "Réussites", value: passed },
    { name: "Échecs", value: failed },
  ];
  const COLORS = ["#10B981", "#EF4444"];

  // Préparation des données pour le bar chart par deliverable (affichage du nom)
  const deliverableStats: Record<string, { name: string; total: number; passed: number }> = {};
  ruleResults.forEach((r) => {
    const deliverableId = r.rule?.deliverableId || "?";
    // Chercher le nom du livrable si possible (toujours re-mapper à chaque rendu)
    const deliverableName = deliverables.find((d) => d.id === deliverableId)?.name || deliverableId;
    if (!deliverableStats[deliverableId]) {
      deliverableStats[deliverableId] = { name: deliverableName, total: 0, passed: 0 };
    } else {
      // Si le nom a changé (deliverables chargé après), on le met à jour
      deliverableStats[deliverableId].name = deliverableName;
    }
    deliverableStats[deliverableId].total++;
    if (r.passed) deliverableStats[deliverableId].passed++;
  });
  const deliverableChartData = Object.values(deliverableStats).map((d) => ({
    name: d.name,
    taux: d.total > 0 ? Math.round((d.passed / d.total) * 100) : 0,
    total: d.total,
    passed: d.passed,
  }));

  console.log(ruleResults);


  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex flex-col gap-6 w-full min-w-0">
        {/* Ligne du résumé, PieChart et Timeline */}
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-6 w-full min-w-0">
          {/* Résumé général */}
          <Card className="col-span-1 xl:col-span-2 w-full">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-around">
              <div className="flex items-center gap-4">
                <ClipboardCheck className="text-blue-600" size={48} />
                <div>
                  <h4 className="text-xl font-bold">Total vérifications</h4>
                  <p className="text-2xl text-blue-600 font-bold">{total}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-24" />
              <div className="flex items-center gap-4">
                <CheckCircle className="text-green-600" size={48} />
                <div>
                  <h4 className="text-xl font-bold">Réussites</h4>
                  <p className="text-2xl text-green-600 font-bold">{passed}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-24" />
              <div className="flex items-center gap-4">
                <XCircle className="text-red-600" size={48} />
                <div>
                  <h4 className="text-xl font-bold">Échecs</h4>
                  <p className="text-2xl text-red-600 font-bold">{failed}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-24" />
              <div className="flex items-center gap-4">
                <Percent className="text-yellow-500" size={48} />
                <div>
                  <h4 className="text-xl font-bold">Taux de réussite</h4>
                  <p className="text-2xl text-yellow-500 font-bold">{passRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <FlexibleCard title="Répartition réussites / échecs" className="flex-1 min-w-[300px] w-full max-w-full overflow-x-auto">
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </FlexibleCard>

          {/* Timeline Chart */}
          <FlexibleCard title="Évolution cumulative des vérifications" className="flex-1 min-w-[300px] w-full max-w-full overflow-x-auto">
            <div className="flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={300} minWidth={300}>
                <LineChart
                  data={(() => {
                    // Group by date and compute cumulative totals
                    const grouped: Record<string, { date: string; passed: number; failed: number }> = {};
                    ruleResults.forEach((r) => {
                      const dateKey = new Date(r.checkedAt).toLocaleDateString();
                      if (!grouped[dateKey]) {
                        grouped[dateKey] = { date: dateKey, passed: 0, failed: 0 };
                      }
                      if (r.passed) {
                        grouped[dateKey].passed++;
                      } else {
                        grouped[dateKey].failed++;
                      }
                    });
                    // Sort and calculate cumulative
                    const sortedDates = Object.keys(grouped).sort(
                      (a, b) => new Date(a).getTime() - new Date(b).getTime()
                    );
                    let cumulativePassed = 0;
                    let cumulativeFailed = 0;
                    return sortedDates.map((date) => {
                      cumulativePassed += grouped[date].passed;
                      cumulativeFailed += grouped[date].failed;
                      return {
                        date,
                        cumulativePassed,
                        cumulativeFailed,
                      };
                    });
                  })()}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cumulativePassed" stroke="#10B981" name="Réussites cumulées" dot />
                  <Line type="monotone" dataKey="cumulativeFailed" stroke="#EF4444" name="Échecs cumulés" dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </FlexibleCard>
        </div>

        {/* Bar Chart en dessous, toute la largeur */}
        <div className="w-full">
          <FlexibleCard title="Taux de validation par livrable" className="w-full max-w-full overflow-x-auto">
            <div className="flex flex-col items-center justify-center">
              {deliverables.length === 0 ? (
                <div className="py-12 text-gray-400">Chargement des livrables…</div>
              ) : (
                <ResponsiveContainer width="100%" height={300} minWidth={300}>
                  <BarChart data={deliverableChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => v + "%"} />
                    <Tooltip formatter={(value: any) => value + "%"} />
                    <Bar dataKey="taux" fill="#10B981" name="Taux de réussite" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </FlexibleCard>
        </div>
      </div>
    </div>
  );
}
