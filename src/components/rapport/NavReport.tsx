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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const data = await fetchRapports(projectId);
      setRapports(data);
      if (data.length > 0) {
        onSelect(data[0]);
      }
    };
    load();
  }, [onSelect]);

  const goPrevious = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    onSelect(rapports[newIndex]);
  };

  const goNext = () => {
    const newIndex = Math.min(currentIndex + 1, rapports.length - 1);
    setCurrentIndex(newIndex);
    onSelect(rapports[newIndex]);
  };

  if (rapports.length === 0) return null;

  return (
    <div className="flex justify-between items-center mb-4">
      <Button variant="ghost" onClick={goPrevious} disabled={currentIndex === 0}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Report précédent
      </Button>
      <Button
        variant="ghost"
        onClick={goNext}
        disabled={currentIndex === rapports.length - 1}
      >
        Report suivant
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}