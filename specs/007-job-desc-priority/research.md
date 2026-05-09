# Research: Prioritize Job Description Requirements in CV Conversion

**Feature**: 007-job-desc-priority  
**Date**: 2026-04-17

## Decision 1: Change scope — prompt only vs. new pipeline stage

**Decision**: Rewrite `PROMPT_TEMPLATE` in `geminiClient.ts` only. No new parsing stage, no pre-processing of the job description in TypeScript.

**Rationale**: The existing pipeline already feeds both CV text and job description to Gemini in a single prompt. Gemini Flash has sufficient context window and reasoning capability to perform gap/contradiction analysis within the same call. Adding a separate TypeScript pre-processing stage would violate the Simplicity (YAGNI) principle and introduce latency with no quality benefit.

**Alternatives considered**:
- *Two-stage pipeline*: First call extracts requirements from job description; second call rewrites CV against them. Rejected — doubles Gemini API calls, risks rate-limit (15 RPM free tier), adds latency, and violates Zero Cost / Simplicity principles.
- *Client-side diff*: Parse CV and job description in TypeScript to produce a structured gap list before calling Gemini. Rejected — brittle NLP in TypeScript; Gemini does this far better natively.

---

## Decision 2: Prompt instruction strategy for contradictions

**Decision**: Instruct Gemini to (a) identify statements in the CV that contradict job requirements, (b) suppress those statements, and (c) re-frame compatible experience in their place. Include an explicit non-fabrication constraint.

**Rationale**: LLMs follow explicit role-framing instructions reliably when given a clear decision tree. The contradiction-suppression instruction must come before the gap-filling instruction so the model processes the CV in the right order of priority.

**Prompt section added** (see quickstart.md for full text):
```
PRIORIDADE DA VAGA:
1. CONTRADIÇÕES: Se o currículo contiver informações que contradizem os requisitos da vaga
   (ex.: preferência presencial vs. vaga remota; nível "júnior" vs. vaga sênior; anos de
   experiência insuficientes), REMOVA ou REESCREVA essas afirmações para alinhar com a vaga.
2. LACUNAS: Se a vaga exigir habilidades ou características que não aparecem explicitamente
   no currículo, mas houver experiência adjacente ou transferível, reapresente-a com a
   terminologia exata da vaga.
3. NUNCA invente experiências, habilidades, anos ou cargos que não existam ou sejam
   inferíveis do currículo original. Quando não houver base no currículo, omita.
```

**Alternatives considered**:
- *Single generic instruction*: "prioritize job description". Rejected — too vague; model may interpret it as permission to fabricate.
- *Chain-of-thought prompt*: Ask model to reason through gaps before writing output. Rejected — produces verbose reasoning in output that `contentParser.ts` cannot handle; risks breaking structured format.

---

## Decision 3: Keyword injection strategy

**Decision**: Add an instruction to use exact job-description keywords in skills and bullet points wherever the candidate's experience supports it.

**Rationale**: ATS keyword matching is the primary product value proposition. Gemini responds well to "use the exact terminology from the job description" phrasing when accompanied by a concrete example.

**Prompt section added**:
```
PALAVRAS-CHAVE ATS: Use a terminologia exata da descrição da vaga nos bullet points de
experiência e na seção HABILIDADES, desde que reflitam experiência real do candidato.
```

**Alternatives considered**:
- *Post-processing keyword injection in TypeScript*: Scan output for required keywords and inject missing ones. Rejected — post-hoc injection cannot safely match keywords to accurate experience bullets; risks fabrication.

---

## Decision 4: Test strategy for prompt changes

**Decision**: Update `geminiClient.test.ts` with fixture-based unit tests that mock the Gemini response and assert that the prompt sent to the API contains the new instruction sections.

**Rationale**: The prompt is a string constant. Unit tests can verify that `generateATSContent` builds the prompt correctly (includes the new sections, inserts `{cvText}` and `{jobDescription}` at the right positions). Integration testing of actual AI output quality is out of scope for automated tests.

**Test cases to add**:
- Prompt includes "PRIORIDADE DA VAGA" section
- Prompt includes "PALAVRAS-CHAVE ATS" section  
- `{cvText}` and `{jobDescription}` placeholders are correctly replaced
- Existing timeout / error-handling behaviour is unchanged

---

## Resolved clarifications

All requirements from the spec were unambiguous at the prompt engineering level. No NEEDS CLARIFICATION markers were carried forward.
