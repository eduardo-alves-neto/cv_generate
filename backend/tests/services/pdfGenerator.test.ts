import { describe, it, expect } from 'vitest'
import { generatePDF } from '../../src/services/pdfGenerator'
import type { ATSContent } from '../../src/types'

const SAMPLE_CONTENT: ATSContent = {
  contactInfo: {
    name: 'Jana Silva',
    email: 'jana@exemplo.com',
    phone: '+55 11 99999-1234',
    location: 'São Paulo, SP',
  },
  summary: 'Engenheira experiente com 8 anos de experiência em TypeScript e Node.js.',
  experience: [
    {
      company: 'Acme Corp',
      role: 'Engenheira Sênior',
      period: 'Jan 2020 – Presente',
      bullets: ['Construiu microsserviços', 'Liderou equipe de 5'],
    },
  ],
  education: [
    {
      institution: 'USP',
      degree: 'Bacharelado em Ciência da Computação',
      period: '2013–2017',
    },
  ],
  skills: ['TypeScript', 'React', 'Node.js'],
}

describe('generatePDF', () => {
  it('returns a non-empty Buffer', async () => {
    const buffer = await generatePDF(SAMPLE_CONTENT)

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('returns a valid PDF (starts with %PDF)', async () => {
    const buffer = await generatePDF(SAMPLE_CONTENT)

    expect(buffer.slice(0, 4).toString()).toBe('%PDF')
  })

  it('handles empty experience and education arrays', async () => {
    const minimal: ATSContent = {
      contactInfo: { name: 'João Silva' },
      experience: [],
      education: [],
      skills: [],
    }

    const buffer = await generatePDF(minimal)

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('renders additionalSections and returns non-empty Buffer', async () => {
    const withExtra: ATSContent = {
      ...SAMPLE_CONTENT,
      additionalSections: [
        { title: 'Projetos', content: 'Projeto X: Sistema de recomendação\n- Python, FastAPI' },
        { title: 'Certificações', content: 'AWS Solutions Architect — 2023' },
      ],
    }

    const buffer = await generatePDF(withExtra)

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('handles undefined additionalSections without error', async () => {
    const noExtra: ATSContent = {
      ...SAMPLE_CONTENT,
      additionalSections: undefined,
    }

    const buffer = await generatePDF(noExtra)

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })
})
