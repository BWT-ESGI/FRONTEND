import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchRapports } from "@/services/rapportService";
import { Report } from "@/types/report.type";

interface NavReportProps {
  projectId: string;
  onSelect: (rapport: Report) => void;
}

export default function NavReport({ projectId, onSelect }: NavReportProps) {
  const [rapports, setRapports] = useState<Report[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Charger les rapports une seule fois au chargement du projet
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRapports(projectId);
        setRapports(data);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Erreur lors du chargement des rapports :", error);
      }
    };

    load();
  }, [projectId]);

  // Notifier le parent du rapport sélectionné quand l’index change
  useEffect(() => {
    if (rapports.length > 0) {
      onSelect(rapports[currentIndex]);
    }
  }, [currentIndex, rapports, onSelect]);

  const goPrevious = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const goNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, rapports.length - 1));
  };

  if (rapports.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center mb-4">
        Aucun rapport disponible pour ce projet.
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="ghost" onClick={goPrevious} disabled={currentIndex === 0}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Rapport précédent
      </Button>
      <span className="text-sm font-medium">
        {rapports[currentIndex]?.group?.name ?? "Groupe"} — Rapport {currentIndex + 1}/{rapports.length}
      </span>
      <Button
        variant="ghost"
        onClick={goNext}
        disabled={currentIndex === rapports.length - 1}
      >
        Rapport suivant
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}