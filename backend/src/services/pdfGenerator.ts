import PDFDocument from 'pdfkit'
import { ATSContent } from '../types'

const FONT_REGULAR = 'Helvetica'
const FONT_BOLD = 'Helvetica-Bold'

const COLORS = {
  heading: '#1a1a2e',
  body: '#2d2d2d',
  muted: '#555555',
  rule: '#cccccc',
}

function addSection(doc: PDFKit.PDFDocument, title: string): void {
  doc
    .moveDown(0.5)
    .font(FONT_BOLD)
    .fontSize(13)
    .fillColor(COLORS.heading)
    .text(title.toUpperCase())
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .strokeColor(COLORS.rule)
    .stroke()
    .moveDown(0.3)
}

export function generatePDF(content: ATSContent): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
      bufferPages: true,
    })

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // ── Contact Info ──────────────────────────────────────────────
    const { contactInfo } = content
    doc
      .font(FONT_BOLD)
      .fontSize(22)
      .fillColor(COLORS.heading)
      .text(contactInfo.name, { align: 'center' })
      .moveDown(0.2)

    const contactParts: string[] = []
    if (contactInfo.email) contactParts.push(contactInfo.email)
    if (contactInfo.phone) contactParts.push(contactInfo.phone)
    if (contactInfo.location) contactParts.push(contactInfo.location)
    if (contactInfo.linkedin) contactParts.push(contactInfo.linkedin)

    if (contactParts.length > 0) {
      doc
        .font(FONT_REGULAR)
        .fontSize(10)
        .fillColor(COLORS.muted)
        .text(contactParts.join('  |  '), { align: 'center' })
    }

    // ── Summary ───────────────────────────────────────────────────
    if (content.summary) {
      addSection(doc, 'Professional Summary')
      doc
        .font(FONT_REGULAR)
        .fontSize(11)
        .fillColor(COLORS.body)
        .text(content.summary, { align: 'justify', lineGap: 2 })
    }

    // ── Experience ────────────────────────────────────────────────
    if (content.experience.length > 0) {
      addSection(doc, 'Experience')
      for (const exp of content.experience) {
        doc
          .font(FONT_BOLD)
          .fontSize(11)
          .fillColor(COLORS.heading)
          .text(exp.role)
          .font(FONT_REGULAR)
          .fontSize(10)
          .fillColor(COLORS.muted)
          .text(`${exp.company}  ·  ${exp.period}`)
          .moveDown(0.2)

        for (const bullet of exp.bullets) {
          doc
            .font(FONT_REGULAR)
            .fontSize(10)
            .fillColor(COLORS.body)
            .text(`• ${bullet}`, { indent: 10, lineGap: 1 })
        }
        doc.moveDown(0.4)
      }
    }

    // ── Education ─────────────────────────────────────────────────
    if (content.education.length > 0) {
      addSection(doc, 'Education')
      for (const edu of content.education) {
        doc
          .font(FONT_BOLD)
          .fontSize(11)
          .fillColor(COLORS.heading)
          .text(edu.degree)
          .font(FONT_REGULAR)
          .fontSize(10)
          .fillColor(COLORS.muted)
          .text(edu.period ? `${edu.institution}  ·  ${edu.period}` : edu.institution)
          .moveDown(0.4)
      }
    }

    // ── Skills ────────────────────────────────────────────────────
    if (content.skills.length > 0) {
      addSection(doc, 'Skills')
      doc
        .font(FONT_REGULAR)
        .fontSize(10)
        .fillColor(COLORS.body)
        .text(content.skills.join('  ·  '), { lineGap: 2 })
    }

    doc.end()
  })
}
