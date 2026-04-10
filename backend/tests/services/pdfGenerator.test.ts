import { describe, it, expect } from 'vitest'
import { generatePDF } from '../../src/services/pdfGenerator'
import type { ATSContent } from '../../src/types'

const SAMPLE_CONTENT: ATSContent = {
  contactInfo: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 555 000 1234',
    location: 'New York, NY',
  },
  summary: 'Experienced engineer with 8 years of experience.',
  experience: [
    {
      company: 'Acme Corp',
      role: 'Senior Engineer',
      period: 'Jan 2020 – Present',
      bullets: ['Built microservices', 'Led team of 5'],
    },
  ],
  education: [
    {
      institution: 'MIT',
      degree: 'BS Computer Science',
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
      contactInfo: { name: 'John Doe' },
      experience: [],
      education: [],
      skills: [],
    }

    const buffer = await generatePDF(minimal)

    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.length).toBeGreaterThan(0)
  })
})
