import { GoogleGenAI } from '@google/genai'
import { AppError } from '../middleware/errorHandler'

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 30_000)

const PROMPT_TEMPLATE = `Rewrite the CV below as ATS-optimized for the given job. Output ONLY the structured content — no commentary, no markdown fences.

FORMAT (use these exact headers):
## CONTACT
Name: ...
Email: ...
Phone: ...
Location: ...

## SUMMARY
[2 sentences tailored to the job]

## EXPERIENCE
Company: ...
Role: ...
Period: ...
- bullet
- bullet

## EDUCATION
Institution: ...
Degree: ...
Period: ...

## SKILLS
skill1, skill2, skill3

CV:
{cvText}

JOB:
{jobDescription}`

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new AppError(
      'AI_UNAVAILABLE',
      'GEMINI_API_KEY is not set. Add it to backend/.env to enable AI conversion.',
    )
  }
  return new GoogleGenAI({ apiKey })
}

export async function generateATSContent(
  cvText: string,
  jobDescription: string,
): Promise<string> {
  const prompt = PROMPT_TEMPLATE
    .replace('{cvText}', cvText)
    .replace('{jobDescription}', jobDescription)

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new AppError('AI_TIMEOUT', 'The AI service took too long to respond. Please try again.')),
      GEMINI_TIMEOUT_MS,
    ),
  )

  const generationPromise = (async () => {
    try {
      const ai = getClient()
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      })
      return response.text ?? ''
    } catch (err) {
      if (err instanceof AppError) throw err

      const message = err instanceof Error ? err.message : String(err)

      if (message.includes('API_KEY_INVALID') || message.includes('API key not valid')) {
        throw new AppError(
          'AI_UNAVAILABLE',
          'The Gemini API key is invalid. Check GEMINI_API_KEY in backend/.env.',
        )
      }

      if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
        throw new AppError(
          'AI_UNAVAILABLE',
          'Gemini free-tier rate limit reached (15 RPM). Please wait a moment and try again.',
        )
      }

      throw new AppError('AI_UNAVAILABLE', `Gemini API error: ${message.slice(0, 200)}`)
    }
  })()

  return Promise.race([generationPromise, timeoutPromise])
}
