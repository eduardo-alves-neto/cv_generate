export type ConversionStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ContactInfo {
  name: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
}

export interface ExperienceEntry {
  company: string
  role: string
  period: string
  bullets: string[]
}

export interface EducationEntry {
  institution: string
  degree: string
  period?: string
}

export interface AdditionalSection {
  title: string
  content: string
}

export interface ATSContent {
  contactInfo: ContactInfo
  summary?: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  additionalSections?: AdditionalSection[]
}

export interface ATSResult {
  jobId: string
  pdfBuffer: Buffer
  structuredContent: ATSContent
  createdAt: Date
}

export interface ConversionJob {
  id: string
  cvText: string
  jobDescription: string
  status: ConversionStatus
  createdAt: Date
  completedAt?: Date
  errorMessage?: string
  result?: ATSResult
}
