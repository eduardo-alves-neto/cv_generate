import { GoogleGenAI } from '@google/genai'
import { AppError } from '../middleware/errorHandler'

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 30_000)

const PROMPT_TEMPLATE = `Responda APENAS em português (pt-BR). Reescreva o currículo abaixo de forma otimizada para ATS, adaptado para a vaga informada. Retorne SOMENTE o conteúdo estruturado — sem comentários, sem blocos de markdown.

INSTRUÇÃO IMPORTANTE: Inclua TODAS as informações do currículo original que não sejam contraditórias com os requisitos da vaga. Adapte a apresentação quando necessário, mas não omita seções nem experiências relevantes.

FORMATO (use exatamente estes cabeçalhos):
## CONTATO
Nome: ...
Email: ...
Telefone: ...
Localização: ...
LinkedIn: ...

## RESUMO
[2 a 3 frases em português adaptadas para a vaga]

## EXPERIÊNCIA
Empresa: ...
Cargo: ...
Período: ...
- responsabilidade ou conquista
- responsabilidade ou conquista

## EDUCAÇÃO
Instituição: ...
Curso: ...
Período: ...

## HABILIDADES
habilidade1, habilidade2, habilidade3

## SEÇÕES_ADICIONAIS
[Se o currículo original contiver seções além das acima (ex.: Projetos, Certificações, Idiomas, Publicações, Voluntariado), inclua-as aqui usando sub-cabeçalhos ### NomeDaSeção. Se não houver seções adicionais, omita este bloco inteiro.]

CURRÍCULO:
{cvText}

VAGA:
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
