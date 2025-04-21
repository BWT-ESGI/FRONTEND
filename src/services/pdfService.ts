import jsPDF from "jspdf";
import "jspdf-autotable";

export type PdfType = "schedule" | "attendance";

export interface PassageGroup {
  id: string;
  name: string;
  start: string;
  end: string;
}

export function generatePdf(type: PdfType, data: PassageGroup[]): void {
  const doc = new jsPDF();
  if (type === "schedule") {
    doc.text("Ordre de passage des soutenances", 14, 20);
    (doc as any).autoTable({
      head: [["Groupe", "Début", "Fin"]],
      body: data.map(g => [g.name, new Date(g.start).toLocaleString(), new Date(g.end).toLocaleString()]),
      startY: 30,
    });
    doc.save("ordre_passage.pdf");
  } else {
    doc.text("Liste d'émargement", 14, 20);
    (doc as any).autoTable({
      head: [["Groupe", "Signatures"]],
      body: data.map(g => [g.name, "_____ , _____ , _____"]),
      startY: 30,
    });
    doc.save("liste_emargement.pdf");
  }
}