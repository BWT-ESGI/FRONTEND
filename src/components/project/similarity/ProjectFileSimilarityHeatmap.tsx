import { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function fileNameOnly(path: string) {
  if (!path) return "";
  return path.split("/").pop()!;
}

// Style et icône selon la similarité
function simBadge(sim: number) {
  if (sim === 100)
    return { color: "bg-green-500 text-white font-bold", emoji: "👑" };
  if (sim >= 75)
    return { color: "bg-green-200 text-green-900 font-semibold", emoji: "⭐" };
  if (sim >= 30)
    return { color: "bg-yellow-100 text-yellow-800 font-medium", emoji: "🌿" };
  if (sim > 10) return { color: "bg-orange-50 text-orange-800", emoji: "" };
  return { color: "bg-muted-foreground text-xs text-gray-400", emoji: "" };
}

type FileComparison = {
  groupA: string;
  groupB: string;
  fileA: string;
  fileB: string;
  similarity: number;
};

type Props = {
  data: {
    groupComparisons: { groupA: string; groupB: string; similarity: number }[];
    fileComparisons: FileComparison[];
  };
};

export function ProjectFileSimilarityHeatmap({ data }: Props) {
  if (
    !data ||
    !Array.isArray(data.groupComparisons) ||
    !Array.isArray(data.fileComparisons)
  ) {
    return <div>Aucune donnée de comparaison n’est disponible.</div>;
  }

  // Couples uniques de groupes
  const pairs = useMemo(() => {
    const ps: { key: string; a: string; b: string }[] = [];
    data.groupComparisons.forEach((cmp) => {
      const key = [cmp.groupA, cmp.groupB].sort().join("|||");
      if (!ps.some((p) => p.key === key)) {
        ps.push({ key, a: cmp.groupA, b: cmp.groupB });
      }
    });
    return ps;
  }, [data.groupComparisons]);

  const [selectedKey, setSelectedKey] = useState<string | undefined>(
    pairs[0]?.key
  );
  useEffect(() => {
    setSelectedKey(pairs[0]?.key);
  }, [pairs.length, pairs[0]?.key]);

  if (!pairs.length || !selectedKey) {
    return <div>Aucune paire de groupes à comparer.</div>;
  }

  const pair = pairs.find((p) => p.key === selectedKey);
  const fileComps = useMemo(() => {
    if (!pair) return [];
    // Seuil : similarité > 10%
    return data.fileComparisons
      .filter(
        (f) =>
          ((f.groupA === pair.a && f.groupB === pair.b) ||
            (f.groupA === pair.b && f.groupB === pair.a)) &&
          f.similarity > 10
      )
      .sort((a, b) => b.similarity - a.similarity);
  }, [pair, data.fileComparisons]);

  return (
    <Card className="shadow-2xl rounded-2xl border bg-gradient-to-br from-white to-slate-100">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <span>
            <span className="text-lg font-bold text-primary">
              Comparaison raffinée
            </span>
            <span className="ml-2 text-base font-normal text-muted-foreground">
              (fichiers les plus ressemblants)
            </span>
          </span>
          <Tabs value={selectedKey} onValueChange={setSelectedKey}>
            <TabsList className="mt-2">
              {pairs.map((p) => (
                <TabsTrigger key={p.key} value={p.key} className="text-sm">
                  {p.a} / {p.b}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fileComps.length === 0 ? (
          <div className="text-muted-foreground italic">
            Aucune ressemblance marquante entre les fichiers de ces groupes.
          </div>
        ) : (
<ul className="space-y-2 max-h-[400px] overflow-y-auto px-2">
  {fileComps.map((cmp, idx) => {
    const { color, emoji } = simBadge(cmp.similarity);
    // On ajoute une bordure en haut sur le premier élément uniquement
    const borderClass = idx === 0 ? "border-t border-slate-200" : "";
    return (
      <li
        key={idx}
        className={`flex items-center gap-4 px-3 py-2 rounded-xl shadow-sm transition-all hover:bg-primary/5 group
          ${cmp.similarity === 100 ? "ring-2 ring-green-400" : ""} ${borderClass}
        `}
      >
        <span className="flex-1 font-mono text-xs text-gray-700 truncate max-w-[170px] group-hover:text-primary transition">
          {fileNameOnly(cmp.fileA)}
        </span>
        <span className="mx-1 text-lg text-muted-foreground">⟶</span>
        <span className="flex-1 font-mono text-xs text-gray-700 truncate max-w-[170px] group-hover:text-primary transition">
          {fileNameOnly(cmp.fileB)}
        </span>
        <span
          className={`ml-4 text-sm px-3 py-1 rounded-xl shadow font-mono transition-all flex items-center gap-1 ${color}`}
        >
          {emoji}
          {cmp.similarity}%
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
