import { describe, it, expect } from 'vitest'
import { parseATSContent } from '../../src/services/contentParser'

const FULL_SAMPLE = `## CONTACT
Name: Jane Smith
Email: jane@example.com
Phone: +1 555 000 1234
Location: New York, NY

## SUMMARY
Experienced software engineer with 8 years building scalable web applications.

## EXPERIENCE
Company: Acme Corp
Role: Senior Engineer
Period: Jan 2020 – Present
- Built microservices with Node.js
- Led team of 5 engineers

Company: Startup Inc
Role: Backend Developer
Period: Mar 2017 – Dec 2019
- Developed REST APIs

## EDUCATION
Institution: MIT
Degree: BS Computer Science
Period: 2013–2017

## SKILLS
TypeScript, React, Node.js, PostgreSQL`

describe('parseATSContent', () => {
  it('parses all sections correctly', () => {
    const result = parseATSContent(FULL_SAMPLE)

    expect(result.contactInfo.name).toBe('Jane Smith')
    expect(result.contactInfo.email).toBe('jane@example.com')
    expect(result.contactInfo.phone).toBe('+1 555 000 1234')
    expect(result.summary).toContain('software engineer')
    expect(result.experience).toHaveLength(2)
    expect(result.experience[0].company).toBe('Acme Corp')
    expect(result.experience[0].bullets).toHaveLength(2)
    expect(result.education).toHaveLength(1)
    expect(result.education[0].institution).toBe('MIT')
    expect(result.skills).toContain('TypeScript')
    expect(result.skills).toContain('React')
  })

  it('returns empty arrays when optional sections are missing', () => {
    const minimal = `## CONTACT
Name: John Doe

## SKILLS
TypeScript`

    const result = parseATSContent(minimal)

    expect(result.contactInfo.name).toBe('John Doe')
    expect(result.experience).toEqual([])
    expect(result.education).toEqual([])
    expect(result.summary).toBeUndefined()
    expect(result.skills).toContain('TypeScript')
  })

  it('falls back to first line as name when CONTACT section missing', () => {
    const result = parseATSContent('Alice Johnson\nSoftware Engineer')

    expect(result.contactInfo.name).toBe('Alice Johnson')
  })
})
