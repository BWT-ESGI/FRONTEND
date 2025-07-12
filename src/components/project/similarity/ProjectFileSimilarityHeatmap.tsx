import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FlexibleCard from "@/components/template/FlexibleCard";
import FlexibleAlert from "@/components/template/FlexibleAlert";
import { TriangleAlert } from "lucide-react";

function fileNameOnly(path: string) {
  return path.split("/").pop() || path;
}

function simBadge(sim: number) {
  if (sim === 100)    return { class: "bg-red-500 text-white", emoji: "🚩" };
  if (sim >= 75)      return { class: "bg-orange-400 text-white", emoji: "⚠️" };
  if (sim >= 30)      return { class: "bg-yellow-200 text-yellow-900", emoji: "🌿" };
  if (sim > 0)        return { class: "bg-green-100 text-green-900", emoji: "✅" };
  return { class: "bg-muted-foreground text-gray-400", emoji: "" };
}

type FileComparison = { fileA: string; fileB: string; similarity: number };
type GroupComparison = {
  groupA: string;
  groupB: string;
  fileComparisons: FileComparison[];
};

interface Props {
  data: { groupComparisons?: GroupComparison[] };
}

export function ProjectFileSimilarityHeatmap({ data }: Props) {
  const pairs = data.groupComparisons || [];
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [minSim, setMinSim] = useState(0);

  useEffect(() => {
    setSelectedIdx(0);
  }, [pairs.length]);

  if (!pairs.length) {
    return (
      <FlexibleAlert
        title="Aucune paire de groupes à comparer" icon={<TriangleAlert />}
      />
    );
  }

  const { groupA, groupB, fileComparisons } = pairs[selectedIdx];

  const files = fileComparisons
    .filter((f) => f.similarity > 0 && f.similarity >= minSim)
    .sort((a, b) => b.similarity - a.similarity);

  return (
    <FlexibleCard
      title={`Plagiat par fichiers - ${groupA} ↔ ${groupB}`}
      childrenRightEnd={
        <div className="mb-4 flex items-center gap-2">
          <label htmlFor="sim-filter" className="text-xs text-muted-foreground">
            Filtrer par similarité :
          </label>
          <Select
            value={String(minSim)}
            onValueChange={(v) => setMinSim(Number(v))}
          >
            <SelectTrigger id="sim-filter" className="w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tout</SelectItem>
              <SelectItem value="30">≥ 30%</SelectItem>
              <SelectItem value="50">≥ 50%</SelectItem>
              <SelectItem value="75">≥ 75%</SelectItem>
              <SelectItem value="100">100%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }>

      <Tabs
        value={String(selectedIdx)}
        onValueChange={(v) => setSelectedIdx(+v)}
        className="mb-4"
      >
        <TabsList className="mt-2 space-x-2">
          {pairs.map((p, i) => (
            <TabsTrigger key={i} value={String(i)} className="text-sm">
              {p.groupA} ↔ {p.groupB}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

        {files.length === 0 ? (
          <FlexibleAlert
            title="Aucune similarité marquante pour cette paire."
            icon={<TriangleAlert />}
          />
        ) : (
          <ul className="divide-y divide-slate-200 max-h-80 overflow-y-auto">
            {files.map((f, i) => {
              const { class: badgeClass, emoji } = simBadge(f.similarity);
              return (
                <li
                  key={i}
                  className={`
                    flex items-center py-2 px-4 transition hover:bg-primary/5
                    ${i === 0 ? "border-t border-slate-300" : ""}
                  `}
                >
                  <span className="flex-1 text-xs font-mono truncate">
                    {fileNameOnly(f.fileA)}
                  </span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="flex-1 text-xs font-mono truncate">
                    {fileNameOnly(f.fileB)}
                  </span>
                  <span
                    className={`ml-4 px-2 py-1 rounded-full text-sm ${badgeClass}`}
                  >
                    {emoji} {f.similarity.toFixed(2)}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
    </FlexibleCard>
  );
}