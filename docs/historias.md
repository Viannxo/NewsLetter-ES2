# Histórias de usuário — NewsFlow (Vértice)

**Dupla:** Eduardo Vianna Meira — matrícula 844387 · Vitor Alexandre — matrícula 803371
**Disciplina:** Engenharia de Software II · Teste de Software · Prática de BDD

| ID | Título | Ator | Regras | Prioridade | Features |
|----|--------|------|--------|------------|----------|
| US01 | Criar newsletter | Redatora | RN01 | Alta | 3 |
| US02 | Aprovar edição para envio | Revisor | RN02 | Alta | 3 |
| US03 | Agendar envio | Gestora | RN03 | Alta | 3 |
| US04 | Sair e voltar à lista | Assinante | RN06 | Média | 3 |

---

## US01 — Criar newsletter

**Como** redatora
**Quero** inserir, editar e remover texto da edição
**Para** montar a newsletter sem perder o que já escrevi

**Critérios de aceitação**
- É possível inserir texto no corpo da edição; texto em branco é recusado.
- É possível substituir um trecho existente; trecho inexistente gera aviso.
- É possível remover um trecho; corpo vazio gera aviso.
- O rascunho é salvo após 30 segundos sem digitar, gerando uma versão numerada.
- As últimas 20 versões podem ser restauradas, e restaurar uma versão não apaga as seguintes.

**Regras cobertas:** RN01
**Prioridade:** Alta — perda de conteúdo é a reclamação número um dos redatores.
**Cenários:** `features/us01-inserir-texto.feature`, `features/us01-editar-texto.feature`, `features/us01-remover-texto.feature`

---

## US02 — Aprovar edição para envio

**Como** revisor
**Quero** aprovar ou devolver com comentário a edição escrita por outra pessoa
**Para** garantir que nada sai sem conferência, sem virar gargalo da equipe

**Critérios de aceitação**
- Um revisor aprova uma edição que está aguardando revisão.
- O autor não aprova a própria edição, mesmo tendo papel de revisor; quem não é revisor também não aprova.
- A reprovação devolve a edição ao rascunho e exige um comentário, que fica visível para a redatora.
- Só edições aprovadas podem ser agendadas.

**Regras cobertas:** RN02
**Prioridade:** Alta — sem aprovação, um erro de texto chega a 40 mil assinantes.
**Cenários:** `features/us02-aprovar-edicao.feature`, `features/us02-reprovar-edicao.feature`, `features/us02-envio-exige-aprovacao.feature`

---

## US03 — Agendar envio

**Como** gestora de comunicação
**Quero** agendar, reagendar e cancelar o envio de uma edição aprovada
**Para** que ela chegue no melhor horário sem eu precisar apertar o botão na hora

**Critérios de aceitação**
- O envio é agendado com no mínimo 15 minutos de antecedência, no fuso `America/Sao_Paulo`.
- Um envio pode ser reagendado no máximo 2 vezes, respeitando os mesmos 15 minutos.
- Um envio pode ser cancelado até 5 minutos antes do horário marcado.
- Tentativas fora dessas regras mantêm o agendamento como estava e informam o motivo.

**Regras cobertas:** RN03 (e RN02, que exige edição aprovada)
**Prioridade:** Alta — é a fronteira numérica mais importante do sistema e onde os erros custam mais.
**Cenários:** `features/us03-agendar-envio.feature`, `features/us03-reagendar-envio.feature`, `features/us03-cancelar-envio.feature`

---

## US04 — Sair e voltar à lista

**Como** assinante
**Quero** sair da lista pelo link do e-mail e poder voltar quando quiser, confirmando por e-mail
**Para** receber só o que eu aceito, sem ninguém me reinscrever sem meu consentimento

**Critérios de aceitação**
- Todo e-mail traz o link de descadastro.
- O descadastro tem efeito imediato e é confirmado por e-mail.
- O retorno à lista exige duplo opt-in: o link de confirmação vale por 48 horas e só pode ser usado uma vez.
- Quem está fora da lista — inclusive quem pediu retorno e ainda não confirmou — não recebe disparos.

**Regras cobertas:** RN06
**Prioridade:** Média — não trava o fluxo editorial, mas é obrigação legal (LGPD) e protege a reputação da lista.
**Cenários:** `features/us04-descadastrar.feature`, `features/us04-voltar-a-lista.feature`, `features/us04-disparo-respeita-descadastro.feature`
