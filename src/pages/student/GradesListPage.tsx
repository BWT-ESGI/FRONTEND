import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import { fetchGradesForUser } from "@/services/evaluationGridService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableFooter,
} from "@/components/ui/table";
import { Loader2, FileText } from "lucide-react";

type Grade = any; // remplace si tu as un type précis

function computeAverage(grades: Grade[]) {
  if (!grades.length) return 0;
  const total = grades.reduce((acc: number, grid) => {
    const values = Object.values(grid.scores) as number[];
    const sum = values.reduce((a: number, b: number) => Number(a) + Number(b), 0);
    return acc + sum / values.length;
  }, 0);
  return total / grades.length;
}

export default function GradesListPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGradesForUser()
      .then(setGrades)
      .finally(() => setLoading(false));
  }, []);

  // Group by project then by corrector
  const projectsMap: Record<string, { name: string, correctors: Record<string, { name: string, grades: Grade[] }> }> = {};

  grades.forEach((g) => {
    const projectName = g.project?.name || g.projectId;
    const correctorName = g.corrector
      ? `${g.corrector.firstName} ${g.corrector.lastName}`
      : "Enseignant inconnu";
    if (!projectsMap[projectName]) projectsMap[projectName] = { name: projectName, correctors: {} };
    if (!projectsMap[projectName].correctors[correctorName]) projectsMap[projectName].correctors[correctorName] = { name: correctorName, grades: [] };
    projectsMap[projectName].correctors[correctorName].grades.push(g);
  });

  const allGrades = grades;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-8 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : !grades.length ? (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="text-muted-foreground" />
                <span className="font-bold">Aucune note disponible</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Vous n’avez encore aucune grille d’évaluation enregistrée.
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(projectsMap).map(([projectName, { correctors }]) => (
            <Card key={projectName} className="mb-6">
              <CardHeader>
                <h2 className="text-lg font-bold">Projet : {projectName}</h2>
              </CardHeader>
              <CardContent>
                {Object.entries(correctors).map(([correctorName, { grades }]) => (
                  <div key={correctorName} className="mb-6">
                    <div className="w-full font-semibold mb-2">Professeur : {correctorName}</div>
                    <Table className="w-full min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Enseignant</TableHead>
                          <TableHead>Matière</TableHead>
                          <TableHead>Note globale</TableHead>
                          <TableHead>Dernière mise à jour</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grades.map((grid) => (
                          <TableRow key={grid.id}>
                            <TableCell>{grid.corrector.firstName + " " + grid.corrector.lastName}</TableCell>
                            <TableCell>
                              {grid.criteriaScores.criteriaLabel}
                            </TableCell>
                            <TableCell>
                              {grid.scores
                                ? (
                                    Object.values(grid.scores as Record<string, number>).reduce(
                                      (a, b) => Number(a) + Number(b),
                                      0
                                    ) / Object.values(grid.scores as Record<string, number>).length
                                  ).toFixed(2)
                                : "—"}
                            </TableCell>
                            <TableCell>
                              {grid.updatedAt
                                ? new Date(grid.updatedAt).toLocaleDateString()
                                : ""}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2} className="font-bold">Moyenne du projet</TableCell>
                          <TableCell className="font-bold">
                            {computeAverage(grades).toFixed(2)}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
        {/* Moyenne générale */}
        {!!allGrades.length && (
          <Card>
            <CardHeader>
              <div className="font-bold text-center">Moyenne générale tous projets</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-center">
                {computeAverage(allGrades).toFixed(2)} / 20
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}