import { describe, it, expect, vi } from 'vitest'

vi.mock('pdf-parse', () => ({
  default: vi.fn(),
}))

import pdfParse from 'pdf-parse'
import { extractTextFromPdf } from '../../src/services/pdfExtract'

const mockPdfParse = vi.mocked(pdfParse)

describe('extractTextFromPdf', () => {
  it('returns trimmed text from a PDF buffer', async () => {
    mockPdfParse.mockResolvedValue({ text: '  John Doe\nSoftware Engineer  ', numpages: 1, numrender: 1, info: {}, metadata: {}, version: '1.10.100' } as Awaited<ReturnType<typeof pdfParse>>)

    const result = await extractTextFromPdf(Buffer.from('fake'))

    expect(result).toBe('John Doe\nSoftware Engineer')
  })

  it('throws UNREADABLE_PDF when extracted text is empty', async () => {
    mockPdfParse.mockResolvedValue({ text: '   ', numpages: 1, numrender: 1, info: {}, metadata: {}, version: '1.10.100' } as Awaited<ReturnType<typeof pdfParse>>)

    await expect(extractTextFromPdf(Buffer.from('fake'))).rejects.toMatchObject({
      code: 'UNREADABLE_PDF',
    })
  })

  it('throws UNREADABLE_PDF when text is completely empty', async () => {
    mockPdfParse.mockResolvedValue({ text: '', numpages: 1, numrender: 1, info: {}, metadata: {}, version: '1.10.100' } as Awaited<ReturnType<typeof pdfParse>>)

    await expect(extractTextFromPdf(Buffer.from('fake'))).rejects.toMatchObject({
      code: 'UNREADABLE_PDF',
    })
  })
})
