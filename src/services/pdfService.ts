import autoTable from "jspdf-autotable";
import { Defense } from "@/types/defense.type";
import { jsPDF } from "jspdf";
import { getLogoUrlForPdf } from "@/utils/getLogo";


function addHeader(doc: any, pageWidth: number, margin: number, logoUrl: string | undefined, title: string) {
  const headerHeight = 60;
  if (logoUrl) {
    const logoWidth = 160;
    const logoHeight = 60;
    doc.addImage(logoUrl, "PNG", margin, margin, logoWidth, logoHeight);
  }
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(title, pageWidth - margin, margin + 35, { align: "right" });
  // Barre horizontale sous le header
  const barTopMargin = 24;
  const barBottomMargin = 44;
  const barY = margin + headerHeight + barTopMargin;
  const barWidth = pageWidth * 0.6;
  const barX = (pageWidth - barWidth) / 2;
  doc.setDrawColor(180);
  doc.setLineWidth(1);
  doc.line(barX, barY, barX + barWidth, barY);
  return barY + barBottomMargin;
}


/**
 * Génère un PDF de l'ordre de passage stylé avec logo et entête.
 * @param {Defense[]} defenses - Liste des soutenances/groupes avec horaires.
 */
export function generateSchedulePdf(defenses: Defense[]) {
  const doc = new jsPDF({ unit: "pt" });
  const pageWidth = doc.internal.pageSize.width;
  const margin = 40;
  const logoUrl = getLogoUrlForPdf("dark");
  const title = "Ordre de passage";

  // Header harmonisé
  const yOffset = addHeader(doc, pageWidth, margin, logoUrl, title);

  // Préparer les données du tableau
  const head = [["Groupe", "Membres", "Début", "Fin"]];
  const body = defenses.map((d) => [
    d.group.name,
    d.group.members.map((m: any) => `${m.firstName} ${m.lastName}`).join("\n"),
    new Date(d.start).toLocaleString(),
    new Date(d.end).toLocaleString(),
  ]);

  // Tableau stylé
  autoTable(doc, {
    startY: yOffset + 20,
    head,
    body,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [25, 118, 129], textColor: 255 },
    margin: { left: margin, right: margin },
    theme: 'grid',
    columnStyles: {
      1: { cellWidth: 180 }, // Colonne "Membres" plus large
    },
  });

  // Footer harmonisé
  const schedPages = doc.getNumberOfPages();
  for (let i = 1; i <= schedPages; i++) {
    doc.setPage(i);
    // EduProManager centré
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("EduProManager", pageWidth / 2, doc.internal.pageSize.height - 20, { align: "center" });
    // Pagination en bas à droite
    doc.setFontSize(10);
    doc.setTextColor(150);
    const pageLabel = `Page ${i} / ${schedPages}`;
    doc.text(pageLabel, pageWidth - margin, doc.internal.pageSize.height - 20, { align: "right" });
  }

  doc.save("ordre_soutenances.pdf");
}

/**
 * Génère un PDF d'émargement stylé avec logo et entête.
 * @param {Defense[]} defenses - Liste des soutenances/groupes.
 * @param {string} logoDataUrl - Image du logo encodée en Base64 (data:image/png;base64,...)
 */
export function generateAttendancePdf(defenses: Defense[]) {
  const doc = new jsPDF({ unit: "pt" });
  const pageWidth = doc.internal.pageSize.width;
  const margin = 40;
  const logoUrl = getLogoUrlForPdf("dark");
  const title = "Liste d’émargement";

  const yOffset = addHeader(doc, pageWidth, margin, logoUrl, title);
  let y = yOffset + 20;
  defenses.forEach((d) => {
    // Nouvelle page si nécessaire
    if (y > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = addHeader(doc, pageWidth, margin, logoUrl, title) + 20;
    }
    // Encadré du groupe
    doc.setDrawColor(200);
    doc.setFillColor(245, 245, 245);
    doc.rect(margin - 5, y - 15, pageWidth - margin * 2 + 10, 25, "F");
    doc.setFontSize(16);
    doc.setTextColor(33);
    doc.text(`${d.group.name}`, margin, y);
    y += 30;
    // Membre
    doc.setFontSize(12);
    doc.setTextColor(50);
    d.group.members.forEach((m) => {
      if (y > doc.internal.pageSize.height - margin) {
        doc.addPage();
        y = addHeader(doc, pageWidth, margin, logoUrl, title) + 20;
      }
      doc.text(`• ${m.firstName} ${m.lastName}`, margin, y);
      // Ligne de signature
      const lineY = y + 4;
      doc.line(pageWidth - margin - 150, lineY, pageWidth - margin, lineY);
      y += 30;
    });
    // Espace entre les groupes
    y += 20;
  });

  // Footer harmonisé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // EduProManager centré
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("EduProManager", pageWidth / 2, doc.internal.pageSize.height - 20, { align: "center" });
    // Pagination en bas à droite
    doc.setFontSize(10);
    doc.setTextColor(150);
    const pageLabel = `Page ${i} / ${pageCount}`;
    doc.text(pageLabel, pageWidth - margin, doc.internal.pageSize.height - 20, { align: "right" });
  }

  doc.save("emargement_soutenances.pdf");
}


export function generatePdf(
  mode: "schedule" | "attendance",
  defenses: Defense[],
) {
  if (mode === "schedule") {
    generateSchedulePdf(defenses);
  } else {
    generateAttendancePdf(defenses);
  }
}