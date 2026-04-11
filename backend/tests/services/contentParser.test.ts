import { describe, it, expect } from 'vitest'
import { parseATSContent } from '../../src/services/contentParser'

const FULL_SAMPLE_PT = `## CONTATO
Nome: Jana Silva
Email: jana@exemplo.com
Telefone: +55 11 99999-1234
Localização: São Paulo, SP
LinkedIn: linkedin.com/in/janasilva

## RESUMO
Engenheira de software com 8 anos de experiência construindo aplicações web escaláveis em TypeScript e Node.js.

## EXPERIÊNCIA
Empresa: Acme Corp
Cargo: Engenheira Sênior
Período: Jan 2020 – Presente
- Construiu microsserviços com Node.js
- Liderou equipe de 5 engenheiros

Empresa: Startup Inc
Cargo: Desenvolvedora Backend
Período: Mar 2017 – Dez 2019
- Desenvolveu APIs REST
- Implementou pipelines de CI/CD

## EDUCAÇÃO
Instituição: USP
Curso: Bacharelado em Ciência da Computação
Período: 2013–2017

## HABILIDADES
TypeScript, React, Node.js, PostgreSQL

## SEÇÕES_ADICIONAIS
### Projetos
Projeto X: Sistema de recomendação com ML — Python, FastAPI
Projeto Y: CLI open-source — TypeScript

### Certificações
AWS Solutions Architect Associate — 2023
Google Cloud Professional — 2022`

describe('parseATSContent — Portuguese headers', () => {
  it('parses all standard Portuguese sections correctly', () => {
    const result = parseATSContent(FULL_SAMPLE_PT)

    expect(result.contactInfo.name).toBe('Jana Silva')
    expect(result.contactInfo.email).toBe('jana@exemplo.com')
    expect(result.contactInfo.phone).toBe('+55 11 99999-1234')
    expect(result.contactInfo.location).toBe('São Paulo, SP')
    expect(result.contactInfo.linkedin).toBe('linkedin.com/in/janasilva')
    expect(result.summary).toContain('TypeScript')
    expect(result.experience).toHaveLength(2)
    expect(result.experience[0].company).toBe('Acme Corp')
    expect(result.experience[0].role).toBe('Engenheira Sênior')
    expect(result.experience[0].period).toBe('Jan 2020 – Presente')
    expect(result.experience[0].bullets).toHaveLength(2)
    expect(result.experience[1].company).toBe('Startup Inc')
    expect(result.education).toHaveLength(1)
    expect(result.education[0].institution).toBe('USP')
    expect(result.education[0].degree).toBe('Bacharelado em Ciência da Computação')
    expect(result.skills).toContain('TypeScript')
    expect(result.skills).toContain('React')
  })

  it('parses SEÇÕES_ADICIONAIS into additionalSections array', () => {
    const result = parseATSContent(FULL_SAMPLE_PT)

    expect(result.additionalSections).toHaveLength(2)
    expect(result.additionalSections![0].title).toBe('Projetos')
    expect(result.additionalSections![0].content).toContain('Projeto X')
    expect(result.additionalSections![1].title).toBe('Certificações')
    expect(result.additionalSections![1].content).toContain('AWS')
  })

  it('returns additionalSections as undefined when SEÇÕES_ADICIONAIS block is absent', () => {
    const noExtra = `## CONTATO
Nome: João Silva
Email: joao@exemplo.com

## HABILIDADES
TypeScript`

    const result = parseATSContent(noExtra)

    expect(result.contactInfo.name).toBe('João Silva')
    expect(result.additionalSections).toBeUndefined()
  })

  it('returns empty arrays for optional sections when missing', () => {
    const minimal = `## CONTATO
Nome: João Silva

## HABILIDADES
TypeScript`

    const result = parseATSContent(minimal)

    expect(result.contactInfo.name).toBe('João Silva')
    expect(result.experience).toEqual([])
    expect(result.education).toEqual([])
    expect(result.summary).toBeUndefined()
    expect(result.skills).toContain('TypeScript')
  })

  it('falls back to first line as name when CONTATO section missing', () => {
    const result = parseATSContent('Alice Johnson\nEngenheira de Software')

    expect(result.contactInfo.name).toBe('Alice Johnson')
  })
})
