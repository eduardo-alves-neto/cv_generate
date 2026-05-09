# Quickstart: Prioritize Job Description Requirements in CV Conversion

**Feature**: 007-job-desc-priority  
**Date**: 2026-04-17

## What changes

Single file: `backend/src/services/geminiClient.ts` — replace `PROMPT_TEMPLATE`.

## New PROMPT_TEMPLATE

The updated prompt adds two new instruction blocks — **PRIORIDADE DA VAGA** and **PALAVRAS-CHAVE ATS** — inserted immediately before the `FORMATO` block. Everything else (format, section headers, placeholders) stays the same so `contentParser.ts` continues to work without modification.

```
Responda APENAS em português (pt-BR). Reescreva o currículo abaixo de forma otimizada para ATS, adaptado para a vaga informada. Retorne SOMENTE o conteúdo estruturado — sem comentários, sem blocos de markdown.

INSTRUÇÃO IMPORTANTE: Inclua TODAS as informações do currículo original que não sejam contraditórias com os requisitos da vaga. Adapte a apresentação quando necessário, mas não omita seções nem experiências relevantes.

PRIORIDADE DA VAGA:
1. CONTRADIÇÕES: Se o currículo contiver informações que contradizem os requisitos da vaga (ex.: preferência de trabalho presencial vs. vaga remota; título "júnior" vs. vaga sênior; menos anos de experiência do que o exigido), REMOVA ou REESCREVA essas afirmações para alinhar com os requisitos da vaga. No lugar, destaque experiências compatíveis presentes no currículo.
2. LACUNAS DE HABILIDADES: Se a vaga exigir habilidades, tecnologias, metodologias ou características que não aparecem explicitamente no currículo, mas houver experiência adjacente ou transferível, reapresente essa experiência com a terminologia exata usada na descrição da vaga.
3. MODO DE TRABALHO E CONTEXTO: Se a vaga especificar um contexto de trabalho (ex.: startup, indústria regulada, equipe internacional, trabalho remoto), identifique e destaque no currículo quaisquer indicadores de compatibilidade (autonomia, entregas rápidas, múltiplos papéis, trabalho remoto anterior).
4. NUNCA invente experiências, habilidades, anos de experiência ou cargos que não existam ou não sejam diretamente inferíveis do currículo original. Quando não houver base real no currículo para atender um requisito da vaga, omita — não fabrique.

PALAVRAS-CHAVE ATS: Nos bullet points de experiência e na seção HABILIDADES, use a terminologia exata da descrição da vaga sempre que a experiência real do candidato suportar. Isso maximiza a correspondência com sistemas ATS sem distorcer os fatos.

FORMATO (use exatamente estes cabeçalhos):
## CONTATO
Nome: ...
Email: ...
Telefone: ...
Localização: ...
LinkedIn: ...

## RESUMO
[2 a 3 frases em português adaptadas para a vaga]

## EXPERIÊNCIA
Empresa: ...
Cargo: ...
Período: ...
- responsabilidade ou conquista
- responsabilidade ou conquista

## EDUCAÇÃO
Instituição: ...
Curso: ...
Período: ...

## HABILIDADES
habilidade1, habilidade2, habilidade3

## SEÇÕES_ADICIONAIS
[Se o currículo original contiver seções além das acima (ex.: Projetos, Certificações, Idiomas, Publicações, Voluntariado), inclua-as aqui usando sub-cabeçalhos ### NomeDaSeção. Se não houver seções adicionais, omita este bloco inteiro.]

CURRÍCULO:
{cvText}

VAGA:
{jobDescription}
```

## Testing the change

```bash
# Run unit tests
pnpm test --filter=backend

# Manual smoke test (requires Gemini API key in .env)
pnpm dev
# Then use the UI to upload a CV against a job description that requires
# remote work — verify the output does not carry any on-site preference statement.
```

## Verification checklist

- [ ] `PRIORIDADE DA VAGA` block is present in the prompt
- [ ] `PALAVRAS-CHAVE ATS` block is present in the prompt
- [ ] `{cvText}` and `{jobDescription}` placeholders still present and replaced correctly
- [ ] `contentParser.ts` section headers unchanged (CONTATO, RESUMO, EXPERIÊNCIA, EDUCAÇÃO, HABILIDADES, SEÇÕES_ADICIONAIS)
- [ ] All existing unit tests in `geminiClient.test.ts` pass
- [ ] New unit tests for prompt content pass
- [ ] End-to-end conversion completes within 30 seconds
