import { ATSContent, ContactInfo, ExperienceEntry, EducationEntry } from '../types'

function extractSection(text: string, header: string, nextHeader?: string): string {
  const start = text.indexOf(`## ${header}`)
  if (start === -1) return ''
  const contentStart = text.indexOf('\n', start) + 1
  const end = nextHeader ? text.indexOf(`## ${nextHeader}`, contentStart) : text.length
  return text.slice(contentStart, end === -1 ? text.length : end).trim()
}

function parseContact(section: string): ContactInfo {
  const lines = section.split('\n').map(l => l.trim()).filter(Boolean)
  const contact: ContactInfo = { name: '' }

  for (const line of lines) {
    const [key, ...rest] = line.split(':')
    const value = rest.join(':').trim()
    if (!value) continue

    switch (key.trim().toLowerCase()) {
      case 'name': contact.name = value; break
      case 'email': contact.email = value; break
      case 'phone': contact.phone = value; break
      case 'location': contact.location = value; break
      case 'linkedin': contact.linkedin = value; break
    }
  }

  return contact
}

function parseExperience(section: string): ExperienceEntry[] {
  if (!section) return []

  const entries: ExperienceEntry[] = []
  // Split by blank line or by "Company:" line
  const blocks = section.split(/\n(?=Company:)/i).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const entry: ExperienceEntry = { company: '', role: '', period: '', bullets: [] }

    for (const line of lines) {
      if (line.toLowerCase().startsWith('company:')) {
        entry.company = line.slice('company:'.length).trim()
      } else if (line.toLowerCase().startsWith('role:')) {
        entry.role = line.slice('role:'.length).trim()
      } else if (line.toLowerCase().startsWith('period:')) {
        entry.period = line.slice('period:'.length).trim()
      } else if (line.startsWith('- ')) {
        entry.bullets.push(line.slice(2).trim())
      }
    }

    if (entry.company || entry.role) {
      entries.push(entry)
    }
  }

  return entries
}

function parseEducation(section: string): EducationEntry[] {
  if (!section) return []

  const entries: EducationEntry[] = []
  const blocks = section.split(/\n(?=Institution:)/i).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const entry: EducationEntry = { institution: '', degree: '' }

    for (const line of lines) {
      if (line.toLowerCase().startsWith('institution:')) {
        entry.institution = line.slice('institution:'.length).trim()
      } else if (line.toLowerCase().startsWith('degree:')) {
        entry.degree = line.slice('degree:'.length).trim()
      } else if (line.toLowerCase().startsWith('period:')) {
        entry.period = line.slice('period:'.length).trim()
      }
    }

    if (entry.institution || entry.degree) {
      entries.push(entry)
    }
  }

  return entries
}

function parseSkills(section: string): string[] {
  if (!section) return []
  return section
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

export function parseATSContent(rawText: string): ATSContent {
  const sections = ['CONTACT', 'SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS']

  const contactSection = extractSection(rawText, 'CONTACT', 'SUMMARY')
  const summarySection = extractSection(rawText, 'SUMMARY', 'EXPERIENCE')
  const experienceSection = extractSection(rawText, 'EXPERIENCE', 'EDUCATION')
  const educationSection = extractSection(rawText, 'EDUCATION', 'SKILLS')
  const skillsSection = extractSection(rawText, 'SKILLS')

  const contactInfo = parseContact(contactSection)

  // Fallback: if no name found, extract first non-empty line
  if (!contactInfo.name) {
    const firstLine = rawText.split('\n').find(l => l.trim() && !l.startsWith('#'))
    contactInfo.name = firstLine?.trim() ?? 'Unknown'
  }

  return {
    contactInfo,
    summary: summarySection || undefined,
    experience: parseExperience(experienceSection),
    education: parseEducation(educationSection),
    skills: parseSkills(skillsSection),
  }
}
