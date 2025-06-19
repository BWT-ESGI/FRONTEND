import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { FileText, FolderUp, Presentation, ChevronDown, ChevronUp } from "lucide-react";
import { fetchUserGrades } from "@/services/evaluationGridService";
import FlexibleCard from "../template/FlexibleCard";

interface ProjectGradesProps {
  projectId: string;
}

export default function ProjectGrades({ projectId }: ProjectGradesProps) {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchUserGrades().then((gradesByProject) => {
      const found = gradesByProject.find((p: any) => p.projectId === projectId);
      setProject(found || null);
      if (found && found.grades) {
        const openAll: { [key: string]: boolean } = {};
        found.grades.forEach((grid: any, idx: number) => {
          const gridId = grid.gridId || idx;
          openAll[gridId] = true;
        });
        setOpenDetails(openAll);
      }
      setLoading(false);
    });
  }, [projectId]);

  if (loading) return <div>Chargement des notes...</div>;
  if (!project) return <div>Aucune note disponible pour ce projet.</div>;

  const projectGlobalGrades = project.grades.map((g: any) => g.global).filter(Number.isFinite);
  const projectAverage = projectGlobalGrades.length ? (projectGlobalGrades.reduce((a: number, b: number) => a + b, 0) / projectGlobalGrades.length) : null;

  return (
    <div>
      <FlexibleCard title={projectAverage !== null ? `Moyenne du projet : ${projectAverage.toFixed(2)} / 20` : "Moyenne du projet : —"}>
          {project.grades.map((grid: any, idx: number) => {
            const gridId = grid.gridId || idx;
            const isOpen = openDetails[gridId];
            let typeIcon = <FileText className="w-5 h-5 inline mr-1" />;
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
                <div className="flex items-center justify-between px-4 py-2 cursor-pointer select-none hover:bg-muted/40" onClick={() => setOpenDetails(prev => ({ ...prev, [gridId]: !prev[gridId] }))}>
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
    </FlexibleCard>
  </div>
  );
}
