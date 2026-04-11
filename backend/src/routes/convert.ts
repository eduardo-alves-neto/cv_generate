import { Router, Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { ConvertRequestBodySchema } from '@cv-ats/shared'
import { upload } from '../middleware/upload'
import { AppError } from '../middleware/errorHandler'
import { extractTextFromPdf } from '../services/pdfExtract'
import { generateATSContent } from '../services/geminiClient'
import { parseATSContent } from '../services/contentParser'
import { generatePDF } from '../services/pdfGenerator'
import { jobs } from '../store/jobs'

export const convertRouter = Router()

convertRouter.post(
  '/',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('INVALID_FILE', 'A PDF file is required.')
      }

      const parsed = ConvertRequestBodySchema.safeParse(req.body)
      if (!parsed.success) {
        throw new AppError(
          'INVALID_JOB_DESCRIPTION',
          parsed.error.errors[0]?.message ?? 'Invalid job description.',
        )
      }

      const { jobDescription } = parsed.data
      const jobId = uuidv4()

      jobs.set(jobId, {
        id: jobId,
        cvText: '',
        jobDescription,
        status: 'processing',
        createdAt: new Date(),
      })

      const cvText = await extractTextFromPdf(req.file.buffer)

      const rawAIResponse = await generateATSContent(cvText, jobDescription)

      const structuredContent = parseATSContent(rawAIResponse)

      const pdfBuffer = await generatePDF(structuredContent)

      jobs.set(jobId, {
        id: jobId,
        cvText,
        jobDescription,
        status: 'completed',
        createdAt: jobs.get(jobId)!.createdAt,
        completedAt: new Date(),
        result: {
          jobId,
          pdfBuffer,
          structuredContent,
          createdAt: new Date(),
        },
      })

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ats-cv-${jobId}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'X-Job-Id': jobId,
      })

      res.send(pdfBuffer)
    } catch (err) {
      next(err)
    }
  },
)
