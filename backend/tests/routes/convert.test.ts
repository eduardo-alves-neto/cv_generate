import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../src/app'

vi.mock('../../src/services/pdfExtract', () => ({
  extractTextFromPdf: vi.fn(),
}))
vi.mock('../../src/services/geminiClient', () => ({
  generateATSContent: vi.fn(),
}))
vi.mock('../../src/services/contentParser', () => ({
  parseATSContent: vi.fn(),
}))
vi.mock('../../src/services/pdfGenerator', () => ({
  generatePDF: vi.fn(),
}))

import { extractTextFromPdf } from '../../src/services/pdfExtract'
import { generateATSContent } from '../../src/services/geminiClient'
import { parseATSContent } from '../../src/services/contentParser'
import { generatePDF } from '../../src/services/pdfGenerator'
import { AppError } from '../../src/middleware/errorHandler'

const mockExtract = vi.mocked(extractTextFromPdf)
const mockOllama = vi.mocked(generateATSContent)
const mockParser = vi.mocked(parseATSContent)
const mockGen = vi.mocked(generatePDF)

const MINIMAL_ATS = {
  contactInfo: { name: 'Test User' },
  experience: [],
  education: [],
  skills: [],
}

describe('POST /api/convert', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 415 when no file is provided', async () => {
    const res = await request(app)
      .post('/api/convert')
      .field('jobDescription', 'Software Engineer role')

    expect(res.status).toBe(415)
    expect(res.body.code).toBe('INVALID_FILE')
  })

  it('returns 415 when file is not a PDF', async () => {
    const res = await request(app)
      .post('/api/convert')
      .field('jobDescription', 'Software Engineer role')
      .attach('file', Buffer.from('not a pdf'), { filename: 'resume.docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

    expect(res.status).toBe(415)
    expect(res.body.code).toBe('INVALID_FILE')
  })

  it('returns 422 when PDF has no extractable text', async () => {
    mockExtract.mockRejectedValue(new AppError('UNREADABLE_PDF', 'No text found'))

    const res = await request(app)
      .post('/api/convert')
      .field('jobDescription', 'Software Engineer role')
      .attach('file', Buffer.from('%PDF-1.4 empty'), { filename: 'resume.pdf', contentType: 'application/pdf' })

    expect(res.status).toBe(422)
    expect(res.body.code).toBe('UNREADABLE_PDF')
  })

  it('returns 503 when Ollama is unavailable', async () => {
    mockExtract.mockResolvedValue('CV text here')
    mockOllama.mockRejectedValue(new AppError('AI_UNAVAILABLE', 'Not running'))

    const res = await request(app)
      .post('/api/convert')
      .field('jobDescription', 'Software Engineer role')
      .attach('file', Buffer.from('%PDF-1.4'), { filename: 'resume.pdf', contentType: 'application/pdf' })

    expect(res.status).toBe(503)
    expect(res.body.code).toBe('AI_UNAVAILABLE')
  })

  it('returns 200 PDF on successful conversion', async () => {
    const fakePdf = Buffer.from('%PDF-1.4 fake pdf content')
    mockExtract.mockResolvedValue('CV text here')
    mockOllama.mockResolvedValue('## CONTACT\nName: Test User')
    mockParser.mockReturnValue(MINIMAL_ATS)
    mockGen.mockResolvedValue(fakePdf)

    const res = await request(app)
      .post('/api/convert')
      .field('jobDescription', 'Software Engineer role')
      .attach('file', Buffer.from('%PDF-1.4'), { filename: 'resume.pdf', contentType: 'application/pdf' })

    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toContain('application/pdf')
  })
})
