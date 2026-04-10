import pdfParse from 'pdf-parse'
import { AppError } from '../middleware/errorHandler'

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  let data: Awaited<ReturnType<typeof pdfParse>>
  try {
    data = await pdfParse(buffer)
  } catch {
    throw new AppError(
      'UNREADABLE_PDF',
      'This PDF could not be parsed. Please use a text-based PDF or copy-paste your CV content.',
    )
  }
  const text = data.text.trim()

  if (!text) {
    throw new AppError(
      'UNREADABLE_PDF',
      'This PDF contains no extractable text. Please use a text-based PDF or copy-paste your CV content.',
    )
  }

  return text
}
