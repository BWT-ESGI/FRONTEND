import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Defense } from "@/types/defense.type";


export function generateSchedulePdf(defenses: Defense[]) {
  const doc = new jsPDF({ unit: "pt" });
  doc.setFontSize(18);
  doc.text("Ordre de passage des soutenances", 40, 40);

  const head = [["Groupe", "Début", "Fin"]];
  const body = defenses.map((d) => [
    d.group.name,
    new Date(d.start).toLocaleString(),
    new Date(d.end).toLocaleString(),
  ]);

  autoTable(doc, {
    startY: 60,
    head,
    body,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 40, right: 40 },
  });

  doc.save("ordre_soutenances.pdf");
}

export function generateAttendancePdf(defenses: Defense[]) {
  const doc = new jsPDF({ unit: "pt" });
  doc.setFontSize(18);
  doc.text("Liste d’émargement", 40, 40);

  let yOffset = 60;
  defenses.forEach((d) => {
    if (yOffset > doc.internal.pageSize.height - 60) {
      doc.addPage();
      yOffset = 40;
    }

    doc.setFontSize(14);
    doc.text(`Groupe : ${d.group.name}`, 40, yOffset);
    yOffset += 20;

    doc.setFontSize(11);
    d.group.members.forEach((m) => {
      doc.text(`• ${m.firstName} ${m.lastName}`, 60, yOffset);
      yOffset += 14;
      if (yOffset > doc.internal.pageSize.height - 60) {
        doc.addPage();
        yOffset = 40;
      }
    });

    yOffset += 20;
  });

  doc.save("emargement_soutenances.pdf");
}

export function generatePdf(
  mode: "schedule" | "attendance",
  defenses: Defense[]
) {
  if (mode === "schedule") {
    generateSchedulePdf(defenses);
  } else {
    generateAttendancePdf(defenses);
  }
}