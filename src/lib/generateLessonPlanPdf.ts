import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateLessonPlanPdf(lessonPlanData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { height } = page.getSize();

  let y = height - 40;
  const fontSize = 12;
  const lineHeight = 20;

  const drawLine = (text: string, bold = false) => {
    page.drawText(text, {
      x: 40,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
    y -= lineHeight;
    if (y < 50) {
      const newPage = pdfDoc.addPage([595, 842]);
      y = height - 40;
    }
  };

  drawLine(`Lesson Overview: ${lessonPlanData.overview}`);
  y -= lineHeight;

  lessonPlanData.periods.forEach((period: any, i: number) => {
    drawLine(`Period ${i + 1}: ${period.title}`, true);
    period.sections.forEach((section: any) => {
      drawLine(`- ${section.name}:`);
      section.points.forEach((point: string) => drawLine(`  • ${point}`));
    });
    drawLine(`Activity: ${period.activity}`);
    drawLine(`Differentiation: ${period.differentiation}`);
    drawLine(`Extension: ${period.extension}`);
    y -= lineHeight;
  });

  const pdfBytes = await pdfDoc.save();

  // Trigger download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'lesson_plan.pdf';
  link.click();
}
