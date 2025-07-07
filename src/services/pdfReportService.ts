import html2pdf from "html2pdf.js";
import { Section } from "@/types/sections.type";
import { getLogoUrlForPdf } from "@/utils/getLogo";

/**
 * Generates the full report PDF using html2pdf.js, which wraps html2canvas and jsPDF.
 */
export async function generateFullReportPdf(
  sections: Section[],
  projectTitle: string = "Rapport complet",
  groupName?: string,
  members?: { firstName: string; lastName: string }[]
) {

  const container = document.createElement("div");
  // Fit content within PDF page width and apply side padding equal to margins
  container.style.width = "100%";
  container.style.padding = "0 40px";
  container.style.boxSizing = "border-box";
  // Append heading styles
  const headingStyles = document.createElement("style");
  headingStyles.innerHTML = `
  h1 { font-size: 24pt; font-weight: bold; }
  h2 { font-size: 18pt; font-weight: bold; }
  h3 { font-size: 16pt; font-weight: bold; }
  h4 { font-size: 14pt; font-weight: bold; }
  h5 { font-size: 12pt; font-weight: bold; }
  h6 { font-size: 10pt; font-weight: bold; }
  br { display: block; margin-bottom: 0.5em; }
  p, div { text-align: justify; }
  ul { list-style-type: disc; margin: 0 0 1em 0; padding-left: 1.5em; }
  ol { list-style-type: decimal; margin: 0 0 1em 0; padding-left: 1.5em; }
  li { margin-bottom: 0.5em; text-indent: 0; vertical-align: middle; }
`;
  container.appendChild(headingStyles);
  container.style.textAlign = "justify";

  // Page de garde (cover page)
  const coverDiv = document.createElement("div");
  coverDiv.style.display = "flex";
  coverDiv.style.flexDirection = "column";
  coverDiv.style.justifyContent = "center";
  coverDiv.style.alignItems = "center";
  coverDiv.style.height = "900px"; // A4 height in px at 96dpi ~1122px, but 900px is visually centered
  coverDiv.style.pageBreakAfter = "always";
  coverDiv.style.textAlign = "center";

  // Group name
  if (groupName) {
    const groupTitle = document.createElement("h1");
    groupTitle.textContent = groupName;
    groupTitle.style.fontSize = "32pt";
    groupTitle.style.marginBottom = "32px";
    coverDiv.appendChild(groupTitle);
  }

  // Members
  if (members && members.length > 0) {
    const membersDiv = document.createElement("div");
    membersDiv.style.fontSize = "18pt";
    membersDiv.style.marginBottom = "24px";
    membersDiv.textContent = members.map(m => `${m.firstName} ${m.lastName}`).join(", ");
    coverDiv.appendChild(membersDiv);
  }

  container.appendChild(coverDiv);

  // Définition des options AVANT d'utiliser opt dans les sections
  const opt = {
    margin: [150, 40, 40, 40],
    filename: `rapport_complet_${groupName || "sans_groupe"}.pdf`,
    image: { type: "png", quality: 1.0 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      onclone: (clonedDoc: Document) => {
        // Override any CSS color functions
        const styleTag = clonedDoc.createElement("style");
        styleTag.innerHTML = `
          * {
            color: #333333 !important;
            background-color: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important;
          }
        `;
        clonedDoc.head.appendChild(styleTag);
      },
    },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
  };

  // Sections
  sections.forEach((sec, idx) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.style.boxSizing = "border-box";
    // Utilise les mêmes marges latérales que le footer (opt.margin[1] et opt.margin[3])
    sectionDiv.style.paddingLeft = opt.margin[1] + "px";
    sectionDiv.style.paddingRight = opt.margin[3] + "px";
    // Ne pas mettre de pageBreakBefore sur la première section (juste après la couverture)
    if (idx !== 0) {
      sectionDiv.style.pageBreakBefore = "always";
    }
    // Add top margin so content doesn’t overlap with header overlay
    // Convert <br> into block-level line breaks
    const contentWithBreaks = sec.content
      ? sec.content.replace(
        /<br\s*\/?>/gi,
        '<div style="height:0.5em"></div>'
      )
      : "";
    sectionDiv.innerHTML = `
          <h2 style="font-size:18pt; font-weight:bold; margin-bottom:0.5em;">
            ${sec.title}
          </h2>
          ${contentWithBreaks}
        `;
    container.appendChild(sectionDiv);
  });

  const worker = html2pdf().set(opt).from(container);
  worker
    .toPdf()
    .get("pdf")
    .then((pdf: any) => {
      const headerMargin = 40;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const headerHeight = 60;
      const barWidth = pageWidth * 0.6;
      const barX = (pageWidth - barWidth) / 2;
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        // Header
        pdf.addImage(
          getLogoUrlForPdf("dark"),
          "PNG",
          headerMargin,
          headerMargin,
          160,
          60
        );
        pdf.setFont("helvetica", "bold").setFontSize(20);
        pdf.setTextColor(51, 51, 51); 
        pdf.text(
          `${projectTitle}${groupName ? " - " + groupName : ""}`,
          pageWidth - headerMargin,
          headerMargin + 35,
          { align: "right" }
        );
        const barY = headerMargin + headerHeight + 12;
        pdf
          .setDrawColor(180)
          .setLineWidth(1)
          .line(barX, barY, barX + barWidth, barY);
        // Footer
        pdf.setFontSize(10).setTextColor(150);
        // Affiche la date lastEdit de la section correspondante à gauche du footer
        let dateStr = "";
        if (i === 1) {
          // Page de garde : pas de date
          dateStr = "";
        } else {
          const secIndex = i - 2;
          if (secIndex >= 0 && secIndex < sections.length) {
            dateStr = sections[secIndex]?.lastEdit
              ? new Date(sections[secIndex].lastEdit).toLocaleDateString()
              : "";
          }
        }
        pdf.text(dateStr, opt.margin[1], pageHeight - 20, { align: "left" });
        pdf
          .setTextColor(100)
          .text("EduProManager", pageWidth / 2, pageHeight - 20, {
            align: "center",
          });
        pdf.text(
          `Page ${i} / ${totalPages}`,
          pageWidth - opt.margin[3],
          pageHeight - 20,
          { align: "right" }
        );
        // Note en haut du footer sur la première page
        if (i === 1) {
          pdf.setFontSize(11).setTextColor(220, 38, 38); // Rouge
          pdf.text(
            "Note : la date affichée en bas à gauche correspond à la dernière mise à jour de la section.",
            pageWidth / 2,
            pageHeight - 40,
            { align: "center" }
          );
        }
      }
      pdf.save(opt.filename);
    });
}
