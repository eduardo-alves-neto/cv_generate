# Feature Specification: Melhorar Formatação do PDF e Preservar Informações em Português

**Feature Branch**: `003-pdf-format-pt`  
**Created**: 2026-04-10  
**Status**: Draft  
**Input**: User description: "temos que melhorar a formatação do pdf e ajustar para que ele não omita as informações do pdf original(caso não seja contraditorio com a vaga) e a linguagem tem que estar em portugues"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — PDF ATS Gerado em Português com Todas as Informações Preservadas (Priority: P1)

Um usuário faz upload do seu currículo em PDF (em qualquer idioma) e cola uma vaga de emprego. O sistema gera um PDF ATS-otimizado **em português**, preservando todas as informações relevantes do currículo original — como experiências, formação, habilidades e dados de contato — sem omitir nenhuma informação que não seja contraditória com os requisitos da vaga.

**Why this priority**: É o fluxo principal do produto. Sem isso, nenhuma outra melhoria tem valor prático. A omissão de informações e o idioma errado foram os problemas reportados diretamente pelo usuário.

**Independent Test**: Fazer upload de um currículo com 5 experiências de trabalho e uma formação acadêmica + colar uma vaga → baixar o PDF gerado → verificar que todas as 5 experiências e a formação aparecem no PDF em português.

**Acceptance Scenarios**:

1. **Given** um currículo com múltiplas experiências profissionais, **When** o usuário submete o formulário com uma vaga de emprego, **Then** o PDF gerado contém todas as experiências do currículo original e o texto está em português.
2. **Given** um currículo com informações neutras em relação à vaga (ex.: idiomas, certificações, projetos pessoais), **When** o usuário converte, **Then** essas informações aparecem no PDF final em português.
3. **Given** um currículo com uma seção que não está entre as seções ATS padrão (ex.: "Publicações", "Projetos"), **When** o usuário converte, **Then** essa seção é incluída no PDF em português.
4. **Given** um currículo originalmente em inglês, **When** o usuário converte com qualquer vaga, **Then** o PDF gerado está inteiramente em português.

---

### User Story 2 — Formatação Visual Melhorada no PDF Gerado (Priority: P2)

O PDF ATS gerado deve ser visualmente organizado e fácil de ler: hierarquia clara de seções, espaçamento adequado, títulos em destaque e informações bem agrupadas — mantendo compatibilidade ATS (sem tabelas, sem colunas múltiplas, sem gráficos).

**Why this priority**: Um PDF visualmente legível aumenta a confiança do usuário no resultado, mas o conteúdo correto (US1) vem primeiro.

**Independent Test**: Abrir o PDF gerado em um visualizador de PDF e verificar que: (a) seções têm títulos visualmente distintos; (b) itens estão alinhados; (c) há espaçamento entre seções; (d) não há sobreposição de texto.

**Acceptance Scenarios**:

1. **Given** um currículo com as seções contato, resumo, experiência, formação e habilidades, **When** o PDF é gerado, **Then** cada seção tem um título visualmente distinto e separação clara das demais.
2. **Given** experiências com datas e descrições, **When** renderizadas no PDF, **Then** o cargo e empresa aparecem em destaque com as descrições abaixo, com espaçamento consistente.
3. **Given** uma lista de habilidades, **When** renderizada no PDF, **Then** os itens estão organizados de forma legível (não como bloco de texto corrido).
4. **Given** qualquer currículo submetido, **When** o PDF é gerado, **Then** o documento não tem sobreposição de texto, fontes ilegíveis ou margens que cortam o conteúdo.

---

### Edge Cases

- O que acontece quando o currículo tem uma seção não-padrão (ex.: "Projetos Pessoais", "Publicações")? → Deve ser incluída no PDF em português.
- O que acontece quando o currículo é muito extenso (conteúdo que ultrapassa uma página)? → O PDF deve incluir todo o conteúdo mesmo que ocupe múltiplas páginas.
- O que acontece quando o currículo está em inglês e a vaga em português? → O PDF deve ser gerado em português.
- O que acontece quando a IA retorna conteúdo parcialmente em inglês mesmo com instrução de português? → O sistema aceita o resultado da IA sem pós-processamento de idioma; a qualidade depende do prompt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE gerar o PDF ATS inteiramente em português (pt-BR), independentemente do idioma do currículo original ou da vaga.
- **FR-002**: O sistema DEVE preservar todas as informações do currículo original no PDF gerado, a menos que a informação seja explicitamente contraditória com os requisitos da vaga.
- **FR-003**: O sistema DEVE incluir seções não-padrão do currículo original (ex.: "Projetos", "Publicações", "Certificações", "Idiomas") no PDF gerado, em português.
- **FR-004**: O prompt enviado à IA DEVE instruir explicitamente: (a) responder em português (pt-BR); (b) não omitir informações relevantes do currículo; (c) adaptar — não remover — informações que precisem de ajuste para a vaga.
- **FR-005**: O PDF gerado DEVE ter títulos de seção visualmente distintos do corpo do texto (ex.: negrito e caixa-alta).
- **FR-006**: O PDF gerado DEVE ter espaçamento consistente entre seções e entre itens dentro de cada seção.
- **FR-007**: O PDF gerado DEVE apresentar cada experiência profissional com o cargo e empresa em destaque, seguidos das responsabilidades e período.
- **FR-008**: O PDF gerado DEVE manter compatibilidade ATS: sem tabelas, sem colunas múltiplas, sem cabeçalhos/rodapés decorativos, sem elementos gráficos.

### Key Entities

- **CurrículoOriginal**: Texto extraído do PDF do usuário — contém contato, resumo, experiências, formação, habilidades e possíveis seções adicionais.
- **ConteúdoATS**: Estrutura intermediária produzida pela IA — deve mapear todas as seções do currículo original para português, incluindo seções adicionais.
- **PDFGerado**: Arquivo PDF final — visualmente legível, compatível com ATS e inteiramente em português.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O PDF gerado contém 100% das seções presentes no currículo original (verificável contando seções no input vs. output).
- **SC-002**: O texto do PDF gerado está em português — sem frases ou seções em outro idioma.
- **SC-003**: Um usuário identifica visualmente as seções do PDF (contato, experiência, formação, habilidades) em até 30 segundos, sem treinamento.
- **SC-004**: O PDF gerado é aberto e lido sem erros em ao menos 3 visualizadores comuns (navegador, leitor de PDF nativo do sistema operacional).
- **SC-005**: A conversão completa (upload → download do PDF) permanece dentro do limite de 30 segundos estabelecido pela constituição do projeto.

## Assumptions

- O provedor de IA continuará sendo o Google Gemini; a melhoria se concentra no prompt e na renderização do PDF.
- "Português" refere-se a pt-BR; não há necessidade de suporte a pt-PT nesta versão.
- PDFs de imagem (sem texto extraível) já retornam erro e não são escopo desta feature.
- A compatibilidade ATS (sem tabelas, sem colunas) permanece como restrição não-negociável.
- Seções adicionais do currículo (ex.: "Projetos") serão adicionadas após as seções padrão no PDF gerado.
- A estrutura de parsing e geração de PDF existente será estendida para suportar seções adicionais, não substituída.
