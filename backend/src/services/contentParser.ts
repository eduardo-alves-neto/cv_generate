import { ATSContent, AdditionalSection, ContactInfo, ExperienceEntry, EducationEntry } from '../types'

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
      // Portuguese keys (new)
      case 'nome': contact.name = value; break
      case 'telefone': contact.phone = value; break
      case 'localização':
      case 'localizacao': contact.location = value; break
      // Shared keys (same in both languages)
      case 'email': contact.email = value; break
      case 'linkedin': contact.linkedin = value; break
      // English keys kept as fallback
      case 'name': contact.name = value; break
      case 'phone': contact.phone = value; break
      case 'location': contact.location = value; break
    }
  }

  return contact
}

function parseExperience(section: string): ExperienceEntry[] {
  if (!section) return []

  const entries: ExperienceEntry[] = []
  // Split by blank line or by "Empresa:" / "Company:" line
  const blocks = section.split(/\n(?=Empresa:|Company:)/i).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const entry: ExperienceEntry = { company: '', role: '', period: '', bullets: [] }

    for (const line of lines) {
      const lower = line.toLowerCase()
      if (lower.startsWith('empresa:')) {
        entry.company = line.slice('empresa:'.length).trim()
      } else if (lower.startsWith('cargo:')) {
        entry.role = line.slice('cargo:'.length).trim()
      } else if (lower.startsWith('período:') || lower.startsWith('periodo:')) {
        entry.period = line.slice(line.indexOf(':') + 1).trim()
      } else if (lower.startsWith('company:')) {
        entry.company = line.slice('company:'.length).trim()
      } else if (lower.startsWith('role:')) {
        entry.role = line.slice('role:'.length).trim()
      } else if (lower.startsWith('period:')) {
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
  const blocks = section.split(/\n(?=Instituição:|Institution:)/i).filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const entry: EducationEntry = { institution: '', degree: '' }

    for (const line of lines) {
      const lower = line.toLowerCase()
      if (lower.startsWith('instituição:') || lower.startsWith('instituicao:')) {
        entry.institution = line.slice(line.indexOf(':') + 1).trim()
      } else if (lower.startsWith('curso:')) {
        entry.degree = line.slice('curso:'.length).trim()
      } else if (lower.startsWith('período:') || lower.startsWith('periodo:')) {
        entry.period = line.slice(line.indexOf(':') + 1).trim()
      } else if (lower.startsWith('institution:')) {
        entry.institution = line.slice('institution:'.length).trim()
      } else if (lower.startsWith('degree:')) {
        entry.degree = line.slice('degree:'.length).trim()
      } else if (lower.startsWith('period:')) {
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

function parseAdditionalSections(rawText: string): AdditionalSection[] {
  const additionalStart = rawText.indexOf('## SEÇÕES_ADICIONAIS')
  if (additionalStart === -1) return []

  const contentStart = rawText.indexOf('\n', additionalStart) + 1
  const additionalContent = rawText.slice(contentStart).trim()
  if (!additionalContent) return []

  const sections: AdditionalSection[] = []
  // Split on ### sub-headings
  const parts = additionalContent.split(/^### /m).filter(Boolean)

  for (const part of parts) {
    const firstNewline = part.indexOf('\n')
    if (firstNewline === -1) {
      sections.push({ title: part.trim(), content: '' })
    } else {
      const title = part.slice(0, firstNewline).trim()
      const content = part.slice(firstNewline + 1).trim()
      if (title) {
        sections.push({ title, content })
      }
    }
  }

  return sections
}

export function parseATSContent(rawText: string): ATSContent {
  const contactSection = extractSection(rawText, 'CONTATO', 'RESUMO')
  const summarySection = extractSection(rawText, 'RESUMO', 'EXPERIÊNCIA')
  const experienceSection = extractSection(rawText, 'EXPERIÊNCIA', 'EDUCAÇÃO')
  const educationSection = extractSection(rawText, 'EDUCAÇÃO', 'HABILIDADES')
  const skillsSection = extractSection(rawText, 'HABILIDADES', 'SEÇÕES_ADICIONAIS')

  const contactInfo = parseContact(contactSection)

  // Fallback: if no name found, extract first non-empty line
  if (!contactInfo.name) {
    const firstLine = rawText.split('\n').find(l => l.trim() && !l.startsWith('#'))
    contactInfo.name = firstLine?.trim() ?? 'Unknown'
  }

  const additionalSections = parseAdditionalSections(rawText)

  return {
    contactInfo,
    summary: summarySection || undefined,
    experience: parseExperience(experienceSection),
    education: parseEducation(educationSection),
    skills: parseSkills(skillsSection),
    additionalSections: additionalSections.length > 0 ? additionalSections : undefined,
  }
}
