import { GoogleGenAI } from '@google/genai'
import { AppError } from '../middleware/errorHandler'

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 30_000)

const PROMPT_TEMPLATE = `Responda APENAS em português (pt-BR). Reescreva o currículo abaixo de forma otimizada para ATS, adaptado para a vaga informada. Retorne SOMENTE o conteúdo estruturado — sem comentários, sem blocos de markdown.

FORMATAÇÃO OBRIGATÓRIA: Use APENAS texto simples. É PROIBIDO usar qualquer formatação markdown dentro do conteúdo — sem asteriscos (**palavra**), sem underline (__palavra__), sem backticks (\`palavra\`), sem qualquer outro marcador inline. Os únicos elementos permitidos são os cabeçalhos ## e ### definidos no FORMATO abaixo e os bullet points iniciados por "- ".

INSTRUÇÃO IMPORTANTE: Inclua TODAS as informações do currículo original que não sejam contraditórias com os requisitos da vaga. Adapte a apresentação quando necessário, mas não omita seções nem experiências relevantes.

PRIORIDADE DA VAGA:
1. CONTRADIÇÕES: Se o currículo contiver informações que contradizem os requisitos da vaga (ex.: preferência de trabalho presencial vs. vaga remota; título "júnior" vs. vaga sênior; menos anos de experiência do que o exigido), REMOVA ou REESCREVA essas afirmações para alinhar com os requisitos da vaga. No lugar, destaque experiências compatíveis presentes no currículo.
2. TEMPO DE EXPERIÊNCIA: Se o currículo declarar explicitamente um tempo de experiência (ex.: "mais de 3 anos", "5 anos de experiência"), PRESERVE essa afirmação — não recalcule nem substitua pelo tempo visível apenas nas entradas de emprego listadas. Só calcule o tempo total somando todos os períodos (incluindo estágios, projetos e freelance) quando o currículo NÃO contiver uma declaração explícita de tempo e o total calculado for superior ao que as entradas individuais sugerem. Se o total honesto (declarado ou calculado) ainda for inferior ao exigido pela vaga, apresente o total pedido pela vaga.
3. LACUNAS DE HABILIDADES: Se a vaga exigir habilidades, tecnologias, metodologias ou características que não aparecem explicitamente no currículo ou apresentar tecnologias com numeros de versões exatas(ex: Angular 19, ou React 18), adicione ou substitua a terminologia exata usada na descrição da vaga.
4. MODO DE TRABALHO E CONTEXTO: Se a vaga especificar um contexto de trabalho (ex.: startup, indústria regulada, equipe internacional, trabalho remoto), identifique e destaque no currículo quaisquer indicadores de compatibilidade (autonomia, entregas rápidas, múltiplos papéis, trabalho remoto anterior).


PALAVRAS-CHAVE ATS: Nos bullet points de experiência e na seção HABILIDADES, use a terminologia exata da descrição da vaga. Isso maximiza a correspondência com sistemas ATS.

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

function getClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey })
}

export async function generateATSContent(
  cvText: string,
  jobDescription: string,
  apiKey: string,
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
      const ai = getClient(apiKey)
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
          'A chave da API Gemini está inválida. Insira sua chave na interface.',
        )
      }

      if (message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED')) {
        throw new AppError(
          'AI_UNAVAILABLE',
          'Limite gratuito do Gemini atingido (15 req/min). Aguarde um momento e tente novamente.',
        )
      }

      throw new AppError('AI_UNAVAILABLE', `Gemini API error: ${message.slice(0, 200)}`)
    }
  })()

  return Promise.race([generationPromise, timeoutPromise])
}
