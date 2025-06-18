import FlexibleCard from "@/components/template/FlexibleCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ComposedChart, Scatter, CartesianGrid, YAxis, Bar, XAxis, ReferenceLine } from "recharts";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SummaryGradesChartSection({
  groupGrades = [],
  average,
  median,
}: {
  groupGrades?: {
    groupName: string;
    defenseGrade?: number | null;
    deliverableGrade?: number | null;
    reportGrade?: number | null;
    globalGrade?: number | null;
  }[];
  average?: number | null;
  median?: number | null;
}) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["defense", "deliverable", "report", "global"]);
  const data = groupGrades.map((g) => ({
    group: g.groupName,
    defense: g.defenseGrade,
    deliverable: g.deliverableGrade,
    report: g.reportGrade,
    global: g.globalGrade,
  }));

  const config = {
    defense: { label: "Défense", color: "#f59e42" },
    deliverable: { label: "Livrable", color: "#3b82f6" },
    report: { label: "Rapport", color: "#22c55e" },
    global: { label: "Note globale", color: "#ef4444" },
  };

  const labelForKey = (key: string) => {
    switch (key) {
      case "defense": return config.defense.label;
      case "deliverable": return config.deliverable.label;
      case "report": return config.report.label;
      case "global": return config.global.label;
      default: return key;
    }
  };

  const handleCheckboxChange = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="col-span-2">
      <FlexibleCard title="Notes par groupe (détail)"
      childrenRightEnd={
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Afficher : {selectedKeys.length === 4 ? "Tout" : selectedKeys.map(labelForKey).join(", ")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={selectedKeys.includes("defense")}
                onCheckedChange={() => handleCheckboxChange("defense")}
              >
                Défense
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedKeys.includes("deliverable")}
                onCheckedChange={() => handleCheckboxChange("deliverable")}
              >
                Livrable
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedKeys.includes("report")}
                onCheckedChange={() => handleCheckboxChange("report")}
              >
                Rapport
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedKeys.includes("global")}
                onCheckedChange={() => handleCheckboxChange("global")}
              >
                Note globale
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedKeys.length === 4}
                onCheckedChange={() => setSelectedKeys(["defense", "deliverable", "report", "global"])}
              >
                Tout sélectionner
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
      }>
        <ChartContainer config={config}>
          <ComposedChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="group" />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={[0, 20]}
              tickFormatter={(value) => `${value} / 20`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {selectedKeys.includes("defense") && (
              <Bar dataKey="defense" fill="#f59e42" name="Défense" />
            )}
            {selectedKeys.includes("deliverable") && (
              <Bar dataKey="deliverable" fill="#3b82f6" name="Livrable" />
            )}
            {selectedKeys.includes("report") && (
              <Bar dataKey="report" fill="#22c55e" name="Rapport" />
            )}
            {selectedKeys.includes("global") && (
              <Scatter dataKey="global" fill="#ef4444" name="Note globale" />
            )}
            {average != null && (
              <ReferenceLine y={average} stroke="#6366f1" strokeDasharray="6 3" label={{ value: "Moyenne", position: "left", fill: "#6366f1" }} />
            )}
            {median != null && (
              <ReferenceLine y={median} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Médiane", position: "left", fill: "#f43f5e" }} />
            )}
          </ComposedChart>
        </ChartContainer>
      </FlexibleCard>
    </div>
  );
}