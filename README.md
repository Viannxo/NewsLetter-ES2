# NewsFlow BDD — do Gherkin ao Cucumber

Engenharia de Software II · Teste de Software · Prática de BDD

| Integrante | Matrícula | Papel principal na dupla |
|---|---|---|
| Eduardo Vianna Meira | 844387 | Negócio (histórias, critérios, fora de escopo) |
| Vitor Alexandre | 803371 | Técnico (steps, World, execução e relatório) |

Os dois fizeram a revisão cruzada: quem escreveu as histórias revisou os cenários, e vice-versa.

## Como rodar

```bash
npm install
npm test           # executa todos os cenários e gera relatorios/cucumber-report.html
npm run test:dry   # valida a sintaxe e confere se todo passo tem implementação
npx cucumber-js --tags "@US03 and @limite"   # só os esquemas de fronteira da US03
```

## O que tem aqui

| Pasta / arquivo | Conteúdo |
|---|---|
| `docs/historias.md` | As 4 histórias (US01–US04) com critérios, regras, prioridade e rastreabilidade |
| `docs/US0X-*.md` | Um documento por história: história, features, Gherkin, action words e JavaScript |
| `features/*.feature` | 12 features (3 por história), todas com `# language: pt` |
| `features/step_definitions/` | Steps de cada história + `comum.steps.js` (passos compartilhados) |
| `features/support/` | `world.js` (estado por cenário) e `dominio.js` (domínio em memória, relógio simulado) |
| `relatorios/cucumber-report.html` | Relatório HTML da última execução |

| História | Ator | Regras | Features |
|---|---|---|---|
| US01 — Criar newsletter | Redatora | RN01 | Inserir texto · Editar texto · Remover texto e restaurar versões |
| US02 — Aprovar edição para envio | Revisor | RN02 | Aprovar edição · Reprovar com comentário · Envio exige aprovação |
| US03 — Agendar envio | Gestora | RN03 | Agendar · Reagendar · Cancelar |
| US04 — Sair e voltar à lista | Assinante | RN06 | Descadastrar · Voltar com duplo opt-in · Disparo respeita descadastro |

Cada feature tem 3 cenários: um caminho feliz (`@feliz`), uma exceção (`@excecao`) e um terceiro cenário — em geral um Esquema do Cenário (`@limite`) que testa o valor exatamente na fronteira e logo ao lado dela (15 minutos, 2 reagendamentos, 5 minutos, 20 versões, 30 segundos, 48 horas).

## Fora de escopo

| Regra | Por que ficou de fora |
|---|---|
| RN04 — Segmentação | Exige um cadastro de segmentos e critérios (plano, cidade, interesse) que seria uma história inteira; a US03 agenda o disparo sem depender disso. |
| RN05 — Frequência | Depende de calendário semanal e fila para a semana seguinte, o que pede várias edições já disparadas; preferimos aprofundar as fronteiras de RN03. |
| RN07 — Falha de entrega | É comportamento do provedor de e-mail (tentativas, *bounces*), sem um ator do negócio que perceba o valor diretamente — não caberia nos três dias de prazo. |
| RN08 — Notificação push | Trata de outro canal (aplicativo) com janela de silêncio e limite diário próprios; mantivemos o recorte só no e-mail. |

## Correções feitas na US01 (versão anterior)

- O `Esquema do Cenário` "Restaurar versão antiga depois de muitas remoções" não tinha remoções: foi renomeado para "Só as últimas 20 versões podem ser restauradas" e passou a verificar que restaurar **não apaga** as versões seguintes (critério que não era testado).
- O salvamento automático ganhou fronteira: 29 segundos → nenhuma versão; 30 → 1 versão; 60 → 1 versão.
- "1 versões salvas" virou "1 versão salva" — o step aceita singular e plural (`versão/versões salva(s)`).
- O código saiu de um único `automacao.js` e foi separado em `support/dominio.js`, `support/world.js` e um arquivo de steps por história, como pede o enunciado.
- Os passos de pré-condição (`que insiro o texto`, `que substituo`) agora falham se a ação não der certo, em vez de seguir em silêncio.

## Saída de `npm test`

```
....................................................................................................................................................................................................................................................................................

52 scenarios (52 passed)
276 steps (276 passed)
0m 0.095s (0m 0.012s executing your code)
```

Por história: US01 13 cenários / 67 passos · US02 11 / 63 · US03 17 / 93 · US04 11 / 53 (os esquemas contam um cenário por linha de Exemplos).
