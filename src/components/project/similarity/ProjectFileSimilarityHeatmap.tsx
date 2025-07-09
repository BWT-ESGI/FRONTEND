import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => {
    setSelectedIdx(0);
  }, [pairs.length]);

  if (!pairs.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune paire de groupes à comparer.
      </div>
    );
  }

  const { groupA, groupB, fileComparisons } = pairs[selectedIdx];

  // keep only sim > 0, sort descending so most similar first
  const files = fileComparisons
    .filter((f) => f.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity);

  return (
    <Card className="rounded-2xl shadow border">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <span className="text-lg font-bold">Plagiat par fichiers</span>
          <span className="text-sm text-muted-foreground">
            {groupA} ↔ {groupB}
          </span>
          <Tabs value={String(selectedIdx)} onValueChange={(v) => setSelectedIdx(+v)}>
            <TabsList className="mt-2 space-x-2">
              {pairs.map((p, i) => (
                <TabsTrigger key={i} value={String(i)} className="text-sm">
                  {p.groupA} ↔ {p.groupB}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {files.length === 0 ? (
          <div className="italic text-center text-muted-foreground py-6">
            Aucune similarité marquante pour cette paire.
          </div>
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
                  <span className={`ml-4 px-2 py-1 rounded-full text-sm ${badgeClass}`}>
                    {emoji} {f.similarity.toFixed(2)}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}