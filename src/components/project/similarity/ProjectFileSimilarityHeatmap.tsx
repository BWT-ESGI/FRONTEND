import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function similarityColor(sim: number | null) {
  if (sim === 100) return "bg-green-400";
  if (sim !== null && sim >= 75) return "bg-green-200";
  if (sim !== null && sim > 0) return "bg-yellow-200";
  if (sim !== null) return "bg-red-100";
  return "";
}

type FileComparison = {
  projectA: string;
  projectB: string;
  fileA: string;
  fileB: string;
  similarity: number;
};

type Props = {
  data: {
    projectComparisons: { projectA: string; projectB: string; similarity: number }[];
    fileComparisons: FileComparison[];
  };
};

export function ProjectFileSimilarityHeatmap({ data }: Props) {
  // Extraire toutes les paires uniques de projets
  const projectPairs = useMemo(() => {
    const pairs: { key: string; a: string; b: string }[] = [];
    data.projectComparisons.forEach((cmp) => {
      const key = [cmp.projectA, cmp.projectB].sort().join("|||");
      if (!pairs.some((p) => p.key === key)) {
        pairs.push({ key, a: cmp.projectA, b: cmp.projectB });
      }
    });
    return pairs;
  }, [data.projectComparisons]);

  // Par défaut, sélectionne la première paire
  const [selectedPairKey, setSelectedPairKey] = useState(projectPairs[0]?.key);

  // Filtres des fichiers pour cette paire de projets
  const { filesA, filesB, matrix } = useMemo(() => {
    const pair = projectPairs.find((p) => p.key === selectedPairKey);
    if (!pair) return { filesA: [], filesB: [], matrix: {} };
    // Trouver tous les fichiers impliqués
    const fileComps = data.fileComparisons.filter(
      (f) =>
        (f.projectA === pair.a && f.projectB === pair.b) ||
        (f.projectA === pair.b && f.projectB === pair.a)
    );
    const filesA = Array.from(new Set(fileComps.map((f) => f.fileA)));
    const filesB = Array.from(new Set(fileComps.map((f) => f.fileB)));
    // Créer matrice
    const matrix: Record<string, Record<string, number | null>> = {};
    filesA.forEach((fa) => {
      matrix[fa] = {};
      filesB.forEach((fb) => {
        const cmp = fileComps.find((f) => f.fileA === fa && f.fileB === fb);
        matrix[fa][fb] = cmp ? cmp.similarity : null;
      });
    });
    return { filesA, filesB, matrix };
  }, [selectedPairKey, data.fileComparisons, projectPairs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Similarité fichiers <span className="font-normal text-muted-foreground">(par paire de projets)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedPairKey} onValueChange={setSelectedPairKey}>
          <TabsList className="mb-4">
            {projectPairs.map((p) => (
              <TabsTrigger key={p.key} value={p.key}>
                {p.a} / {p.b}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="overflow-x-auto">
          <table className="border-collapse min-w-max">
            <thead>
              <tr>
                <th className="px-2 py-1 bg-background"></th>
                {filesB.map((fileB) => (
                  <th key={fileB} className="px-2 py-1 text-xs bg-background">{fileB}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filesA.map((fileA) => (
                <tr key={fileA}>
                  <td className="text-xs font-medium px-2 py-1 bg-background">{fileA}</td>
                  {filesB.map((fileB) => {
                    const sim = matrix[fileA]?.[fileB];
                    return (
                      <td
                        key={fileB}
                        className={`w-14 h-10 text-center font-mono transition-colors ${similarityColor(sim)}`}
                      >
                        {sim !== null && sim !== undefined ? `${sim}%` : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}