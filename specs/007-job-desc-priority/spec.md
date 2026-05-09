# Feature Specification: Prioritize Job Description Requirements in CV Conversion

**Feature Branch**: `007-job-desc-priority`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "quando houver na descrição da vaga coisas que o usuario não tem no curriculo( modo de trabalhar, qualquer especificidade da vaga,habilidades, anos de experiencia, nivel de experiencia) ou que no curriculo contradiz oque a vaga pede temos que dar prioridade ao que a vaga pede"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - CV Contradicts Job Requirements (Priority: P1)

A user submits a CV where certain aspects conflict with the job description — for example, their CV indicates they work exclusively on-site, but the job requires remote work capability. The converted CV should re-frame and surface relevant experience to align with the job's requirement, rather than preserving the contradicting framing.

**Why this priority**: This is the core scenario — a CV that contradicts the job description actively harms the user's chances. Fixing contradictions before filling gaps delivers the most immediate value.

**Independent Test**: Can be tested by uploading a CV that explicitly states "on-site only" against a job description requiring "remote work"; the output CV must not carry the contradicting statement and should instead highlight any remote-compatible experience.

**Acceptance Scenarios**:

1. **Given** a CV stating the user prefers on-site work and a job description requiring remote work, **When** the user converts the CV, **Then** the output does not retain the on-site preference statement and surfaces any relevant remote-compatible experience found in the CV.
2. **Given** a CV listing 2 years of experience and a job description requiring 5+ years, **When** the user converts the CV, **Then** the output maximises the presentation of accumulated experience (projects, freelance, academic) without fabricating years, and frames it to best match the seniority language of the job.
3. **Given** a CV listing "junior" seniority and a job description asking for a "senior" professional, **When** the user converts the CV, **Then** the output highlights leadership moments, ownership, and scope of impact rather than carrying "junior" labels.

---

### User Story 2 - Job Requires Skills Not Mentioned in CV (Priority: P2)

A user submits a CV that does not mention a skill explicitly required by the job description. The converted CV should identify transferable or adjacent experience in the CV and surface it using the exact terminology from the job description.

**Why this priority**: Most CVs underrepresent relevant skills due to terminology mismatches. Bridging this gap via language alignment is the second-highest value action after resolving contradictions.

**Independent Test**: Can be tested by submitting a CV without the word "Agile" against a job description that prominently requires Agile methodology; the output CV should incorporate Agile-related framing wherever the candidate's described work genuinely matches iterative/collaborative patterns.

**Acceptance Scenarios**:

1. **Given** a CV with no mention of a required skill and a job description listing that skill as mandatory, **When** the user converts the CV, **Then** the output identifies any adjacent experience in the CV and rephrases it using the job's terminology where applicable.
2. **Given** a CV where a skill is implied (e.g., "collaborated with cross-functional teams" implies stakeholder communication) and the job explicitly requires that skill, **When** the user converts the CV, **Then** the output surfaces that skill explicitly using the job's language.
3. **Given** a CV with no experience whatsoever related to a required skill (no adjacent competency), **When** the user converts the CV, **Then** the output does not fabricate that skill and leaves the section honest while maximising other relevant content.

---

### User Story 3 - Job-Specific Work Mode or Context Not in CV (Priority: P3)

A user submits a CV that does not address a specific work context required by the job (e.g., startup environment, regulated industry, international team). The converted CV should identify relevant signals in the CV that indicate compatibility with that context and highlight them prominently.

**Why this priority**: Work-mode and context fit are often secondary to skills and contradictions but still impact ATS scoring and recruiter impression. This story completes the coverage of the feature.

**Independent Test**: Can be tested by submitting a generic CV against a job description that emphasises "fast-paced startup environment"; the output must surface any project autonomy, multi-role experience, or velocity indicators from the CV.

**Acceptance Scenarios**:

1. **Given** a CV with no mention of startup experience and a job requiring a startup mindset, **When** the user converts the CV, **Then** the output highlights any indicators of autonomy, rapid delivery, or multi-hat roles from the CV.
2. **Given** a job description in a regulated industry (e.g., finance, healthcare) and a CV with no explicit mention of compliance work, **When** the user converts the CV, **Then** the output surfaces any process-following, documentation, or quality-assurance signals from the CV and frames them within the regulated context.

---

### Edge Cases

- What happens when the CV has no content that can be aligned with any job requirement whatsoever (completely unrelated field)?
- How does the system handle a job description with contradictory requirements (e.g., "junior role" AND "10 years experience")?
- What if the user's CV is so sparse that there is no adjacent experience to surface for a required skill?
- How does the system behave when the same job requirement is both present in the CV and contradicted elsewhere in the same CV?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The conversion process MUST analyse the job description to identify all explicit requirements (skills, experience level, years of experience, work mode, domain-specific context).
- **FR-002**: The conversion process MUST compare identified job requirements against the content of the uploaded CV to detect gaps (requirements absent from the CV) and contradictions (CV content that conflicts with job requirements).
- **FR-003**: When a contradiction is detected, the output CV MUST NOT carry the contradicting statement; it MUST instead surface any compatible experience present elsewhere in the CV.
- **FR-004**: When a required skill or attribute is absent from the CV but adjacent experience exists, the output CV MUST rephrase that experience using the terminology from the job description.
- **FR-005**: The output CV MUST NEVER fabricate experience, skills, years, or qualifications that are not present or inferable from the original CV.
- **FR-006**: When a job requirement cannot be addressed by any content in the CV, the output CV MUST leave that area silent (omit) rather than inventing content.
- **FR-007**: The output CV MUST use the exact keywords and phrases from the job description wherever the candidate's real experience supports it, to maximise ATS keyword matching.
- **FR-008**: Experience duration presented in the output MUST reflect the maximum honest interpretation of the candidate's timeline (e.g., including freelance, academic, and project work) when the job requires more years than the CV's primary employment shows.
- **FR-009**: Seniority labels in the output MUST be replaced or omitted when they contradict the seniority level required by the job; impact language MUST be used instead.

### Key Entities

- **Job Requirement**: An explicit or implicit demand from the job description — may be a skill, experience level, years of experience, work mode, or domain context.
- **CV Content Block**: A discrete section of the user's CV (work experience entry, skill, education, project) that may satisfy, partially satisfy, or contradict a job requirement.
- **Gap**: A job requirement for which no directly matching CV content exists, but for which adjacent or transferable content may exist.
- **Contradiction**: A CV content block that directly conflicts with a job requirement.
- **Alignment Action**: The transformation applied to a CV content block — rephrase, suppress, elevate, or leave unchanged — based on how it relates to job requirements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: For any submitted CV + job description pair, the output CV contains at least 80% of the explicit keywords from the job description's requirements section (where the CV's real experience allows).
- **SC-002**: No output CV retains a statement that directly contradicts a requirement stated in the job description.
- **SC-003**: Users report that the output CV feels more aligned with the target job than the original CV without feeling fabricated — validated by user feedback on the conversion result.
- **SC-004**: Conversion time remains under 30 seconds even with gap/contradiction analysis added to the processing pipeline.
- **SC-005**: Zero cases of fabricated experience (skills, years, roles) in the output — verified by comparing output against the source CV.

## Assumptions

- The job description is provided by the user as free text alongside the CV upload (the current flow already accepts a job description input field).
- The AI model performing the conversion has sufficient context window to process both the full CV and the full job description simultaneously.
- "Prioritise the job description" means framing and surfacing real experience to match job language — it does not mean inventing qualifications the candidate does not have.
- The feature applies to all job description fields equally (skills, work mode, seniority, years of experience, domain context) without requiring the user to manually flag which fields matter.
- The current ATS conversion prompt is the primary artifact to be updated; no new UI input fields are required beyond what already exists.
- Users are expected to review the output before submitting to employers; the system is a drafting aid, not a final authority.
