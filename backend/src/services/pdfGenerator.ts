import PDFDocument from 'pdfkit'
import { ATSContent, AdditionalSection } from '../types'

const FONT_REGULAR = 'Helvetica'
const FONT_BOLD = 'Helvetica-Bold'

const COLORS = {
  heading: '#1a1a2e',
  body: '#2d2d2d',
  muted: '#555555',
}

function addSection(doc: PDFKit.PDFDocument, title: string): void {
  doc.moveDown(1.0)

  const left = doc.page.margins.left
  const right = doc.page.width - doc.page.margins.right
  const y = doc.y

  doc
    .font(FONT_BOLD)
    .fontSize(13)
    .fillColor(COLORS.heading)
    .text(title.toUpperCase(), left, y)

  doc.x = left
  doc.moveDown(0.6)
}

function renderAdditionalSections(doc: PDFKit.PDFDocument, sections: AdditionalSection[]): void {
  for (const sec of sections) {
    addSection(doc, sec.title)
    if (sec.content) {
      const lines = sec.content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (trimmed.startsWith('- ')) {
          doc
            .font(FONT_REGULAR)
            .fontSize(10)
            .fillColor(COLORS.body)
            .text(`• ${trimmed.slice(2)}`, { indent: 10, lineGap: 1 })
        } else {
          doc
            .font(FONT_REGULAR)
            .fontSize(10)
            .fillColor(COLORS.body)
            .text(trimmed, { lineGap: 1 })
        }
      }
    }
    doc.moveDown(0.3)
  }
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

    const left = doc.page.margins.left

    // ── Contact Info ──────────────────────────────────────────────
    const { contactInfo } = content
    doc
      .font(FONT_BOLD)
      .fontSize(22)
      .fillColor(COLORS.heading)
      .text(contactInfo.name, left)

    doc.moveDown(0.1)

    const contactParts: string[] = []
    if (contactInfo.email) contactParts.push(contactInfo.email)
    if (contactInfo.phone) contactParts.push(contactInfo.phone)
    if (contactInfo.location) contactParts.push(contactInfo.location)
    if (contactInfo.linkedin) contactParts.push(contactInfo.linkedin)

    if (contactParts.length > 0) {
      doc
        .font(FONT_REGULAR)
        .fontSize(9)
        .fillColor(COLORS.muted)
        .text(contactParts.join('  ·  '), left)
    }

    // ── Summary ───────────────────────────────────────────────────
    if (content.summary) {
      addSection(doc, 'Resumo Profissional')
      doc
        .font(FONT_REGULAR)
        .fontSize(10)
        .fillColor(COLORS.body)
        .text(content.summary, { align: 'justify', lineGap: 2 })
    }

    // ── Experience ────────────────────────────────────────────────
    if (content.experience.length > 0) {
      addSection(doc, 'Experiência')
      for (const exp of content.experience) {
        doc
          .font(FONT_BOLD)
          .fontSize(11)
          .fillColor(COLORS.heading)
          .text(exp.role)

        doc.moveDown(0.1)

        doc
          .font(FONT_REGULAR)
          .fontSize(10)
          .fillColor(COLORS.muted)
          .text(`${exp.company}  ·  ${exp.period}`)

        doc.moveDown(0.3)

        for (const bullet of exp.bullets) {
          doc
            .font(FONT_REGULAR)
            .fontSize(10)
            .fillColor(COLORS.body)
            .text(`• ${bullet}`, { indent: 10, lineGap: 1 })
        }
        doc.moveDown(0.5)
      }
    }

    // ── Education ─────────────────────────────────────────────────
    if (content.education.length > 0) {
      addSection(doc, 'Educação')
      for (const edu of content.education) {
        doc
          .font(FONT_BOLD)
          .fontSize(11)
          .fillColor(COLORS.heading)
          .text(edu.degree)

        doc.moveDown(0.1)

        doc
          .font(FONT_REGULAR)
          .fontSize(10)
          .fillColor(COLORS.muted)
          .text(edu.period ? `${edu.institution}  ·  ${edu.period}` : edu.institution)

        doc.moveDown(0.4)
      }
    }

    // ── Skills ────────────────────────────────────────────────────
    if (content.skills.length > 0) {
      addSection(doc, 'Habilidades')
      doc
        .font(FONT_REGULAR)
        .fontSize(10)
        .fillColor(COLORS.body)
        .text(content.skills.join('  ·  '), { lineGap: 2 })
    }

    // ── Additional Sections ───────────────────────────────────────
    if (content.additionalSections && content.additionalSections.length > 0) {
      renderAdditionalSections(doc, content.additionalSections)
    }

    doc.end()
  })
}
