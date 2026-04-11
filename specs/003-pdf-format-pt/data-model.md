# Data Model: Melhorar Formatação do PDF e Preservar Informações em Português

**Branch**: `003-pdf-format-pt` | **Date**: 2026-04-10

---

## Changed Entities

### `ATSContent` (extended)

Location: `backend/src/types.ts`

**Current**:
```typescript
interface ATSContent {
  contactInfo: ContactInfo
  summary?: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
}
```

**New** (adds `additionalSections`):
```typescript
interface AdditionalSection {
  title: string    // Portuguese section title as returned by the AI (e.g., "Projetos", "Certificações")
  content: string  // Raw text content of the section (may contain line breaks and bullet points)
}

interface ATSContent {
  contactInfo: ContactInfo
  summary?: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  additionalSections?: AdditionalSection[]  // NEW — any sections beyond the standard 5
}
```

**Validation rules**:
- `additionalSections` is optional; absence means the AI returned only standard sections.
- `AdditionalSection.title` must be non-empty.
- `AdditionalSection.content` may be multi-line; the PDF generator renders it as-is.

---

## Unchanged Entities

The following types are unchanged and carry over from feature 002:

- `ContactInfo` — name, email, phone, location, linkedin
- `ExperienceEntry` — company, role, period, bullets[]
- `EducationEntry` — institution, degree, period?
- `ATSResult` — jobId, pdfBuffer, structuredContent, createdAt
- `ConversionJob` — id, cvText, jobDescription, status, createdAt, completedAt?, errorMessage?, result?

---

## Prompt Output Format (new)

The AI is instructed to produce exactly this structure (Portuguese headers):

```
## CONTATO
Nome: ...
Email: ...
Telefone: ...
Localização: ...
LinkedIn: ...

## RESUMO
[2-3 sentences in Portuguese tailored to the job]

## EXPERIÊNCIA
Empresa: ...
Cargo: ...
Período: ...
- bullet in Portuguese
- bullet in Portuguese

## EDUCAÇÃO
Instituição: ...
Curso: ...
Período: ...

## HABILIDADES
habilidade1, habilidade2, habilidade3

## SEÇÕES_ADICIONAIS
### Projetos
[project content]

### Certificações
[certifications content]
```

**Parser key mapping**:

| AI Header | Parser looks for | `ATSContent` field |
|---|---|---|
| `## CONTATO` | `CONTATO` | `contactInfo` |
| `## RESUMO` | `RESUMO` | `summary` |
| `## EXPERIÊNCIA` | `EXPERIÊNCIA` | `experience` |
| `## EDUCAÇÃO` | `EDUCAÇÃO` | `education` |
| `## HABILIDADES` | `HABILIDADES` | `skills` |
| `## SEÇÕES_ADICIONAIS` | `SEÇÕES_ADICIONAIS` | `additionalSections[]` |

**Contact field key mapping** (parser reads the left side of `Key: Value`):

| AI Key | `ContactInfo` field |
|---|---|
| `Nome` | `name` |
| `Email` | `email` |
| `Telefone` | `phone` |
| `Localização` | `location` |
| `LinkedIn` | `linkedin` |

**Experience field key mapping**:

| AI Key | `ExperienceEntry` field |
|---|---|
| `Empresa` | `company` |
| `Cargo` | `role` |
| `Período` | `period` |
| `- bullet` | `bullets[]` |

**Education field key mapping**:

| AI Key | `EducationEntry` field |
|---|---|
| `Instituição` | `institution` |
| `Curso` | `degree` |
| `Período` | `period` |
