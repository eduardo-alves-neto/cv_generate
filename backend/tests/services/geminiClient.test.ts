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

describe('generateATSContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.GEMINI_API_KEY = 'test-key'
  })

  it('returns text from Gemini response', async () => {
    const fakeText = '## CONTATO\nNome: João Silva\n## HABILIDADES\nTypeScript'
    mockGenerateContent(vi.fn().mockResolvedValue({ text: fakeText }))

    const result = await generateATSContent('CV text', 'Software Engineer job')

    expect(result).toBe(fakeText)
  })

  it('sends prompt containing Portuguese language instruction and key headers', async () => {
    let capturedContents = ''
    mockGenerateContent(vi.fn().mockImplementation(async ({ contents }: { contents: string }) => {
      capturedContents = contents
      return { text: '## CONTATO\nNome: Test' }
    }))

    await generateATSContent('Meu currículo', 'Vaga de engenheiro')

    expect(capturedContents).toContain('pt-BR')
    expect(capturedContents).toContain('CONTATO')
    expect(capturedContents).toContain('SEÇÕES_ADICIONAIS')
    expect(capturedContents).toContain('não omita')
    expect(capturedContents).toContain('Meu currículo')
    expect(capturedContents).toContain('Vaga de engenheiro')
  })

  it('throws AI_UNAVAILABLE when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY

    await expect(generateATSContent('cv', 'job')).rejects.toMatchObject({
      code: 'AI_UNAVAILABLE',
    })
  })

  it('throws AI_UNAVAILABLE on invalid API key error', async () => {
    mockGenerateContent(vi.fn().mockRejectedValue(new Error('API_KEY_INVALID')))

    await expect(generateATSContent('cv', 'job')).rejects.toMatchObject({
      code: 'AI_UNAVAILABLE',
    })
  })

  it('throws AI_UNAVAILABLE on rate limit error', async () => {
    mockGenerateContent(vi.fn().mockRejectedValue(new Error('429 quota exceeded')))

    await expect(generateATSContent('cv', 'job')).rejects.toMatchObject({
      code: 'AI_UNAVAILABLE',
    })
  })
})
