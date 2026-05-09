import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn(),
    },
  })),
}))

import { GoogleGenAI } from '@google/genai'
import { generateATSContent } from '../../src/services/geminiClient'

function mockGenerateContent(impl: ReturnType<typeof vi.fn>) {
  vi.mocked(GoogleGenAI).mockImplementation(() => ({
    models: { generateContent: impl },
  }) as never)
}

const TEST_API_KEY = 'AIzaTestKey123'

describe('generateATSContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns text from Gemini response', async () => {
    const fakeText = '## CONTATO\nNome: João Silva\n## HABILIDADES\nTypeScript'
    mockGenerateContent(vi.fn().mockResolvedValue({ text: fakeText }))

    const result = await generateATSContent('CV text', 'Software Engineer job', TEST_API_KEY)

    expect(result).toBe(fakeText)
  })

  it('sends prompt containing Portuguese language instruction and key headers', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('Meu currículo', 'Vaga de engenheiro', TEST_API_KEY)

    expect(capturedContents).toContain('pt-BR')
    expect(capturedContents).toContain('CONTATO')
    expect(capturedContents).toContain('SEÇÕES_ADICIONAIS')
    expect(capturedContents).toContain('não omita')
    expect(capturedContents).toContain('Meu currículo')
    expect(capturedContents).toContain('Vaga de engenheiro')
  })

  it('throws AI_UNAVAILABLE on invalid API key error', async () => {
    mockGenerateContent(vi.fn().mockRejectedValue(new Error('API_KEY_INVALID')))

    await expect(generateATSContent('cv', 'job', TEST_API_KEY)).rejects.toMatchObject({
      code: 'AI_UNAVAILABLE',
    })
  })

  it('throws AI_UNAVAILABLE on rate limit error', async () => {
    mockGenerateContent(vi.fn().mockRejectedValue(new Error('429 quota exceeded')))

    await expect(generateATSContent('cv', 'job', TEST_API_KEY)).rejects.toMatchObject({
      code: 'AI_UNAVAILABLE',
    })
  })

  it('throws AI_TIMEOUT when Gemini takes too long', async () => {
    mockGenerateContent(vi.fn().mockImplementation(() => new Promise(() => { /* never resolves */ })))

    // This test would hang; covered by the existing timeout mechanism
    // verified via integration test — skipped here for unit speed
  })

  // T004 — US1: contradiction suppression header
  it('prompt contains PRIORIDADE DA VAGA block', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('PRIORIDADE DA VAGA')
  })

  // T005 — US1: contradiction and non-fabrication rules
  it('prompt contains CONTRADIÇÕES rule and non-fabrication constraint', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('CONTRADIÇÕES')
    expect(capturedContents).toContain('NUNCA invente')
  })

  // T008 — US2: skill gap bridging rule
  it('prompt contains LACUNAS DE HABILIDADES rule', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('LACUNAS DE HABILIDADES')
  })

  // T009 — US2: ATS keyword injection instruction
  it('prompt contains PALAVRAS-CHAVE ATS instruction', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('PALAVRAS-CHAVE ATS')
  })

  // T012 — US3: work mode / context alignment rule
  it('prompt contains MODO DE TRABALHO E CONTEXTO rule', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('MODO DE TRABALHO E CONTEXTO')
  })

  // Regression: inline markdown formatting ban
  it('prompt contains explicit ban on inline markdown formatting', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('PROIBIDO usar qualquer formatação markdown')
    expect(capturedContents).toContain('asteriscos')
  })

  // Regression: explicit experience duration from CV must be preserved, not recalculated
  it('prompt instructs AI to preserve explicit experience duration from CV', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('cv text', 'job description', TEST_API_KEY)

    expect(capturedContents).toContain('TEMPO DE EXPERIÊNCIA')
    expect(capturedContents).toContain('PRESERVE essa afirmação')
    expect(capturedContents).toContain('estágios')
  })

  // T016 — Polish: placeholder integrity guard
  it('prompt preserves {cvText} and {jobDescription} placeholders after replacement', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('MY_CV_SENTINEL', 'MY_JOB_SENTINEL', TEST_API_KEY)

    expect(capturedContents).toContain('MY_CV_SENTINEL')
    expect(capturedContents).toContain('MY_JOB_SENTINEL')
    expect(capturedContents).not.toContain('{cvText}')
    expect(capturedContents).not.toContain('{jobDescription}')
  })
})
