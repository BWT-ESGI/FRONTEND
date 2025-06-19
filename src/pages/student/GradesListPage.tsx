import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard.layout";
import { fetchUserGrades } from "@/services/evaluationGridService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Loader2, FileText, ChevronDown, ChevronUp, FileText as FileTextIcon, FolderUp, Presentation } from "lucide-react";

export default function GradesListPage() {
  const [gradesByProject, setGradesByProject] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState<{ [key: string]: boolean }>({});
  const [openProjects, setOpenProjects] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchUserGrades()
      .then(setGradesByProject)
      .finally(() => setLoading(false));
  }, []);

  const projectAverages = gradesByProject.map((project: any) => {
    const projectGlobalGrades = project.grades.map((g: any) => g.global).filter(Number.isFinite);
    return projectGlobalGrades.length ? (projectGlobalGrades.reduce((a: number, b: number) => a + b, 0) / projectGlobalGrades.length) : null;
  }).filter((avg: number | null) => avg !== null);
  const generalAverage = projectAverages.length ? (projectAverages.reduce((a: number, b: number) => a + b, 0) / projectAverages.length) : null;

  const toggleDetails = (gridId: string) => {
    setOpenDetails(prev => ({ ...prev, [gridId]: !prev[gridId] }));
  };
  const toggleProject = (projectId: string) => {
    setOpenProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  return (
    <DashboardLayout>
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : !gradesByProject.length ? (
          <Card className="max-w-2xl mx-auto mt-4">
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
          gradesByProject.map((project: any) => {
            const isProjectOpen = openProjects[project.projectId];
            // Calcul de la moyenne du projet
            const projectGlobalGrades = project.grades.map((g: any) => g.global).filter(Number.isFinite);
            const projectAverage = projectGlobalGrades.length ? (projectGlobalGrades.reduce((a: number, b: number) => a + b, 0) / projectGlobalGrades.length) : null;
            return (
              <div key={project.projectId} className="mb-6 border rounded-lg">
                <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/40" onClick={() => toggleProject(project.projectId)}>
                  <div className="font-bold text-lg">Projet : {project.projectName}</div>
                  <div className="flex items-center gap-4">
                    {projectAverage !== null && (
                      <span className="text-base font-semibold">Moyenne projet : {projectAverage.toFixed(2)} / 20</span>
                    )}
                    {isProjectOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                {isProjectOpen && (
                  <div className="p-4 pt-2">
                    {project.grades.map((grid: any, idx: number) => {
                      const gridId = grid.gridId || idx;
                      const isOpen = openDetails[gridId];
                      let typeIcon = <FileTextIcon className="w-5 h-5 inline mr-1" />;
                      let typeLabel = grid.criteriaSet.type;
                      if (/^defense$/i.test(typeLabel)) {
                        typeIcon = <Presentation className="w-5 h-5 inline mr-1" />;
                        typeLabel = "Soutenance";
                      } else if (/^report$/i.test(typeLabel)) {
                        typeIcon = <FileText className="w-5 h-5 inline mr-1" />;
                        typeLabel = "Rapport";
                      } else if (/^deliverable$/i.test(typeLabel)) {
                        typeIcon = <FolderUp className="w-5 h-5 inline mr-1" />;
                        typeLabel = "Rendu";
                      }
                      return (
                        <div key={gridId} className="mb-6 border rounded-lg">
                          <div className="flex items-center justify-between px-4 py-2 cursor-pointer select-none hover:bg-muted/40" onClick={() => toggleDetails(gridId)}>
                            <div>
                              <span className="font-semibold">{typeIcon} <span className="text-sm text-muted-foreground">({typeLabel})</span> {grid.criteriaSet.title}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-lg">{grid.global !== null ? grid.global + " / 20" : "—"}</span>
                              {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </div>
                          {isOpen && (
                            <div className="p-4 pt-2">
                              <Table className="w-full min-w-[700px]">
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Critère</TableHead>
                                    <TableHead>Note</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Poids</TableHead>
                                    <TableHead>Commentaire</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {grid.details.map((crit: any) => (
                                    <TableRow key={crit.criteriaId}>
                                      <TableCell>{crit.label}</TableCell>
                                      <TableCell>{crit.note !== null ? crit.note + " / 20" : "—"}</TableCell>
                                      <TableCell>{crit.score} / {crit.maxScore}</TableCell>
                                      <TableCell>{crit.weight}</TableCell>
                                      <TableCell>{crit.comment || "—"}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
        {!!projectAverages.length && (
          <Card>
            <CardHeader>
              <div className="font-bold text-center">Moyenne générale tous projets</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-center">
                {generalAverage?.toFixed(2)} / 20
              </div>
            </CardContent>
          </Card>
        )}
    </DashboardLayout>
  );
}