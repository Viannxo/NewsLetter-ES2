# US01 · Criar newsletter

**Dupla:** Eduardo Vianna Meira (844387) · Vitor Alexandre (803371)  
NewsFlow (Vértice) · BDD com Cucumber.js · projeto organizado como no CucumberStudio (pasta da história → features → cenários, action words reutilizáveis e datasets nos esquemas).  
**Resultado da execução (`npx cucumber-js --tags @US01`):** 13 cenários e 67 passos, todos passando.

## 1. História de usuário

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

## 2. Features e cenários

São 3 features, com 3 cenários cada (os esquemas são expandidos pelo dataset de Exemplos).

- **Feature 1: Inserir texto na edição** (`features/us01-inserir-texto.feature`)
  - `@feliz` Cenário: Inserir texto no corpo vazio
  - `@excecao` Cenário: Inserir texto em branco
  - `@limite` Esquema do Cenário: Texto inserido é salvo após 30 segundos sem digitar (dataset com 3 exemplos)
- **Feature 2: Editar texto da edição** (`features/us01-editar-texto.feature`)
  - `@feliz` Cenário: Substituir um trecho do texto
  - `@excecao` Cenário: Substituir um trecho que não existe
  - `@salvamento` Cenário: Edição gera uma nova versão numerada
- **Feature 3: Remover texto e restaurar versões** (`features/us01-remover-texto.feature`)
  - `@feliz` Cenário: Remover um trecho do texto
  - `@excecao` Cenário: Remover texto de um corpo vazio
  - `@limite` Esquema do Cenário: Só as últimas 20 versões podem ser restauradas (dataset com 3 exemplos)

## 3. Gherkin

### Feature 1 · Inserir texto na edição

```gherkin
# language: pt
@US01
Funcionalidade: Inserir texto na edição
  Como redatora
  Quero inserir texto no corpo da edição
  Para começar a escrever a newsletter sem perder o que já escrevi

  Contexto:
    Dado que estou autenticada como redatora
    E que existe a edição "Informativo #43" em rascunho com o corpo vazio

  @feliz
  Cenário: Inserir texto no corpo vazio
    Quando insiro o texto "Olá, assinantes da Vértice!"
    Então o corpo da edição deve ser "Olá, assinantes da Vértice!"

  @excecao
  Cenário: Inserir texto em branco
    Quando insiro o texto "   "
    Então o corpo da edição deve continuar vazio
    E devo ver a mensagem "Digite algum texto para inserir"

  @limite
  Esquema do Cenário: Texto inserido é salvo após 30 segundos sem digitar
    Dado que insiro o texto "Primeiro parágrafo"
    Quando eu espero <segundos> segundos sem digitar
    Então o rascunho deve ter <versoes> versões salvas

    Exemplos:
      | segundos | versoes |
      | 29       | 0       |
      | 30       | 1       |
      | 60       | 1       |
```

### Feature 2 · Editar texto da edição

```gherkin
# language: pt
@US01
Funcionalidade: Editar texto da edição
  Como redatora
  Quero alterar o texto que já escrevi
  Para corrigir e melhorar a newsletter

  Contexto:
    Dado que estou autenticada como redatora
    E que existe a edição "Informativo #43" em rascunho com o corpo "Olá, assinantes!"

  @feliz
  Cenário: Substituir um trecho do texto
    Quando substituo "assinantes" por "leitores"
    Então o corpo da edição deve ser "Olá, leitores!"

  @excecao
  Cenário: Substituir um trecho que não existe
    Quando substituo "clientes" por "leitores"
    Então o corpo da edição deve continuar "Olá, assinantes!"
    E devo ver a mensagem "Trecho não encontrado"

  @salvamento
  Cenário: Edição gera uma nova versão numerada
    Dado que a edição já tem 1 versão salva
    E que substituo "assinantes" por "leitores"
    Quando eu espero 30 segundos sem digitar
    Então o rascunho deve ter 2 versões salvas
    E a versão 2 deve ter o corpo "Olá, leitores!"
```

### Feature 3 · Remover texto e restaurar versões

```gherkin
# language: pt
@US01
Funcionalidade: Remover texto e restaurar versões
  Como redatora
  Quero remover trechos do texto
  Para tirar o que não serve mais, podendo voltar atrás por uma versão salva

  Contexto:
    Dado que estou autenticada como redatora
    E que existe a edição "Informativo #43" em rascunho com o corpo "Olá, assinantes! Aproveite a oferta."

  @feliz
  Cenário: Remover um trecho do texto
    Quando removo o trecho " Aproveite a oferta."
    Então o corpo da edição deve ser "Olá, assinantes!"

  @excecao
  Cenário: Remover texto de um corpo vazio
    Dado que o corpo da edição está vazio
    Quando removo o trecho "oferta"
    Então devo ver a mensagem "Não há texto para remover"

  @limite
  Esquema do Cenário: Só as últimas 20 versões podem ser restauradas
    Dado que a edição já tem <salvas> versões salvas
    Quando restauro a versão <versao>
    Então devo ver a mensagem "<mensagem>"
    E o rascunho deve ter 20 versões salvas

    Exemplos:
      | salvas | versao | mensagem                          |
      | 20     | 1      | Versão restaurada                 |
      | 21     | 2      | Versão restaurada                 |
      | 21     | 1      | Versão indisponível para restauro |
```

## 4. Action words (passos reutilizáveis)

**Dado:**

- `que estou autenticada como redatora`
- `que existe a edição "{titulo}" em rascunho com o corpo vazio` — String
- `que existe a edição "{titulo}" em rascunho com o corpo "{corpo}"` — String, String
- `que o corpo da edição está vazio`
- `que a edição já tem {quantidade} versão/versões salva(s)` — Integer
- `que insiro o texto "{texto}"` — String
- `que substituo "{trecho}" por "{novo}"` — String, String

**Quando:**

- `insiro o texto "{texto}"` — String
- `substituo "{trecho}" por "{novo}"` — String, String
- `removo o trecho "{trecho}"` — String
- `eu espero {segundos} segundos sem digitar` — Integer
- `restauro a versão {numero}` — Integer

**Então:**

- `o corpo da edição deve ser "{esperado}"` — String
- `o corpo da edição deve continuar "{esperado}"` — String
- `o corpo da edição deve continuar vazio`
- `o rascunho deve ter {quantidade} versão/versões salva(s)` — Integer
- `a versão {numero} deve ter o corpo "{corpo}"` — Integer, String

**Reutilizadas de outras histórias / comuns:**

- `devo ver a mensagem "{mensagem}"` — comum.steps.js

Observação: o Cucumber diferencia Dado de Quando; por isso uma ação usada como pré-condição (ex.: "que insiro o texto") também existe como `Given`.

## 5. Código JavaScript (Cucumber.js)

### features/step_definitions/us01-criar-newsletter.steps.js

Steps da história. O estado fica no World (`this`), recriado a cada cenário; o domínio em memória e o relógio simulado (sem `sleep`) estão em `features/support/dominio.js` e `features/support/world.js` (seção 6).

```javascript
// =====================================================================
// US01 · Criar newsletter (RN01) — inserir, editar, remover e restaurar
// =====================================================================
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// ---------------------------- DADO ----------------------------
Given('que estou autenticada como redatora', function () {
  this.servico.autenticar('redatora', 'Carla')
})

Given('que existe a edição {string} em rascunho com o corpo vazio', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, '', 'Carla')
})

Given('que existe a edição {string} em rascunho com o corpo {string}', function (titulo, corpo) {
  this.edicao = this.servico.criarEdicao(titulo, corpo, 'Carla')
})

Given('que o corpo da edição está vazio', function () {
  this.edicao.corpo = ''
})

Given('que a edição já tem {int} versão/versões salva(s)', function (quantidade) {
  this.servico.definirVersoes(this.edicao, quantidade)
})

// Mesmas ações usadas como pré-condição (o Cucumber separa Dado de Quando)
Given('que insiro o texto {string}', function (texto) {
  assert.ok(this.servico.inserirTexto(this.edicao, texto).ok)
})

Given('que substituo {string} por {string}', function (trecho, novo) {
  assert.ok(this.servico.substituirTrecho(this.edicao, trecho, novo).ok)
})

// ---------------------------- QUANDO ----------------------------
When('insiro o texto {string}', function (texto) {
  this.resultado = this.servico.inserirTexto(this.edicao, texto)
})

When('substituo {string} por {string}', function (trecho, novo) {
  this.resultado = this.servico.substituirTrecho(this.edicao, trecho, novo)
})

When('removo o trecho {string}', function (trecho) {
  this.resultado = this.servico.removerTrecho(this.edicao, trecho)
})

When('eu espero {int} segundos sem digitar', function (segundos) {
  this.avancarSegundos(segundos)
})

When('restauro a versão {int}', function (numero) {
  this.resultado = this.servico.restaurarVersao(this.edicao, numero)
})

// ---------------------------- ENTÃO ----------------------------
Then('o corpo da edição deve ser {string}', function (esperado) {
  assert.equal(this.edicao.corpo, esperado)
})

Then('o corpo da edição deve continuar {string}', function (esperado) {
  assert.equal(this.edicao.corpo, esperado)
})

Then('o corpo da edição deve continuar vazio', function () {
  assert.equal(this.edicao.corpo, '')
})

Then('o rascunho deve ter {int} versão/versões salva(s)', function (quantidade) {
  assert.equal(this.edicao.versoes.length, quantidade)
})

Then('a versão {int} deve ter o corpo {string}', function (numero, corpo) {
  const versao = this.edicao.versoes.find((v) => v.numero === numero)
  assert.ok(versao, `A versão ${numero} não existe`)
  assert.equal(versao.corpo, corpo)
})
```

### features/step_definitions/comum.steps.js

```javascript
// =====================================================================
// STEPS COMPARTILHADOS ENTRE AS HISTÓRIAS (action words reutilizáveis)
// =====================================================================
const { Given, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que estou autenticada como gestora', function () {
  this.servico.autenticar('gestora', 'Gestora')
})

Then('devo ver a mensagem {string}', function (esperada) {
  assert.ok(this.resultado, 'Nenhuma ação foi executada neste cenário')
  assert.equal(this.resultado.mensagem, esperada)
})
```

## 6. Suporte (World e domínio em memória)

### features/support/world.js

```javascript
// =====================================================================
// WORLD — recriado antes de cada cenário (nenhum estado vaza entre eles)
// =====================================================================
const { setWorldConstructor } = require('@cucumber/cucumber')
const { Servico, SEGUNDO, MINUTO, HORA } = require('./dominio')

class MundoDoNewsFlow {
  constructor () {
    this.servico = new Servico()
    this.edicao = null
    this.resultado = null
  }

  avancarSegundos (segundos) {
    this.servico.avancarRelogio(segundos * SEGUNDO)
  }

  avancarMinutos (minutos) {
    this.servico.avancarRelogio(minutos * MINUTO)
  }

  avancarHoras (horas) {
    this.servico.avancarRelogio(horas * HORA)
  }
}

setWorldConstructor(MundoDoNewsFlow)
```

### features/support/dominio.js

```javascript
// =====================================================================
// DOMÍNIO EM MEMÓRIA DO NEWSFLOW — relógio simulado, sem sleep real
// Regras implementadas: RN01, RN02, RN03, RN06
// =====================================================================
const SEGUNDO = 1000
const MINUTO = 60 * SEGUNDO
const HORA = 60 * MINUTO

// RN01 — Rascunho
const INTERVALO_AUTOSAVE_MS = 30 * SEGUNDO
const MAXIMO_VERSOES = 20
// RN03 — Agendamento
const ANTECEDENCIA_MINIMA_MIN = 15
const MAXIMO_REAGENDAMENTOS = 2
const LIMITE_CANCELAMENTO_MIN = 5
const FUSO = 'America/Sao_Paulo'
// RN06 — Descadastro
const VALIDADE_OPTIN_MS = 48 * HORA

const SITUACAO = {
  RASCUNHO: 'em rascunho',
  EM_REVISAO: 'aguardando revisão',
  APROVADA: 'aprovada'
}

const ok = (mensagem) => ({ ok: true, mensagem })
const falha = (mensagem) => ({ ok: false, mensagem })

class Edicao {
  constructor (titulo, corpo = '', autor = null) {
    this.titulo = titulo
    this.corpo = corpo
    this.autor = autor
    this.situacao = SITUACAO.RASCUNHO // RN01: toda edição nasce como rascunho
    this.versoes = [] // [{ numero, corpo }]
    this.proximoNumero = 1
    this.alterada = false
    this.ultimaAlteracao = 0
    this.comentarios = [] // [{ revisor, texto }]
    this.aprovadaPor = null
    this.disparo = null // { horario, fuso, reagendamentos, situacao }
  }
}

class Servico {
  constructor () {
    this.agora = 0
    this.usuario = null
    this.edicaoAtiva = null
    this.assinantes = new Map() // email -> { email, naLista, pedidoRetorno }
    this.caixas = new Map() // email -> [{ assunto, linkDescadastro, enviadoEm }]
  }

  // ---------------- relógio ----------------
  avancarRelogio (ms) {
    this.agora += ms
    const e = this.edicaoAtiva
    if (e && e.alterada && this.agora - e.ultimaAlteracao >= INTERVALO_AUTOSAVE_MS) {
      this.salvarVersao(e)
    }
  }

  // ---------------- sessão ----------------
  autenticar (papel, nome = null) {
    this.usuario = { papel, nome }
  }

  criarEdicao (titulo, corpo = '', autor = null) {
    this.edicaoAtiva = new Edicao(titulo, corpo, autor)
    return this.edicaoAtiva
  }

  // =========== US01 · RN01 — texto, versões e restauração ===========
  salvarVersao (edicao) {
    edicao.versoes.push({ numero: edicao.proximoNumero++, corpo: edicao.corpo })
    if (edicao.versoes.length > MAXIMO_VERSOES) edicao.versoes.shift()
    edicao.alterada = false
  }

  definirVersoes (edicao, quantidade) {
    edicao.versoes = []
    edicao.proximoNumero = 1
    for (let i = 0; i < quantidade; i++) this.salvarVersao(edicao)
  }

  restaurarVersao (edicao, numero) {
    const versao = edicao.versoes.find((v) => v.numero === numero)
    if (!versao) return falha('Versão indisponível para restauro')
    edicao.corpo = versao.corpo // não apaga as versões seguintes
    return ok('Versão restaurada')
  }

  registrarAlteracao (edicao) {
    edicao.alterada = true
    edicao.ultimaAlteracao = this.agora
  }

  inserirTexto (edicao, texto) {
    if (texto.trim() === '') return falha('Digite algum texto para inserir')
    edicao.corpo += texto
    this.registrarAlteracao(edicao)
    return ok('Texto inserido')
  }

  substituirTrecho (edicao, trecho, novo) {
    if (!edicao.corpo.includes(trecho)) return falha('Trecho não encontrado')
    edicao.corpo = edicao.corpo.replace(trecho, novo)
    this.registrarAlteracao(edicao)
    return ok('Texto atualizado')
  }

  removerTrecho (edicao, trecho) {
    if (edicao.corpo === '') return falha('Não há texto para remover')
    if (!edicao.corpo.includes(trecho)) return falha('Trecho não encontrado')
    edicao.corpo = edicao.corpo.replace(trecho, '')
    this.registrarAlteracao(edicao)
    return ok('Texto removido')
  }

  // =========== US02 · RN02 — aprovação e reprovação ===========
  enviarParaRevisao (edicao) {
    edicao.situacao = SITUACAO.EM_REVISAO
  }

  validarRevisor (edicao) {
    if (!this.usuario || this.usuario.papel !== 'revisor') {
      return falha('Somente revisores podem aprovar edições')
    }
    if (edicao.situacao !== SITUACAO.EM_REVISAO) {
      return falha('A edição não está aguardando revisão')
    }
    return null
  }

  aprovar (edicao) {
    const erro = this.validarRevisor(edicao)
    if (erro) return erro
    if (this.usuario.nome === edicao.autor) {
      return falha('O autor não pode aprovar a própria edição')
    }
    edicao.situacao = SITUACAO.APROVADA
    edicao.aprovadaPor = this.usuario.nome
    return ok('Edição aprovada')
  }

  reprovar (edicao, comentario) {
    const erro = this.validarRevisor(edicao)
    if (erro) return erro
    if (!comentario || comentario.trim() === '') {
      return falha('O comentário é obrigatório para reprovar')
    }
    edicao.situacao = SITUACAO.RASCUNHO
    edicao.comentarios.push({ revisor: this.usuario.nome, texto: comentario })
    return ok('Edição devolvida ao rascunho')
  }

  // =========== US03 · RN03 — agendar, reagendar e cancelar ===========
  agendar (edicao, minutos) {
    if (edicao.situacao !== SITUACAO.APROVADA) {
      return falha('A edição precisa ser aprovada por um revisor')
    }
    if (minutos < ANTECEDENCIA_MINIMA_MIN) {
      return falha('O envio precisa de ao menos 15 minutos')
    }
    edicao.disparo = {
      horario: this.agora + minutos * MINUTO,
      fuso: FUSO,
      reagendamentos: 0,
      situacao: 'agendado'
    }
    return ok('Envio agendado')
  }

  reagendar (edicao, minutos) {
    const d = edicao.disparo
    if (!d || d.situacao !== 'agendado') return falha('Não há envio agendado para esta edição')
    if (d.reagendamentos >= MAXIMO_REAGENDAMENTOS) {
      return falha('O envio só pode ser reagendado 2 vezes')
    }
    if (minutos < ANTECEDENCIA_MINIMA_MIN) {
      return falha('O envio precisa de ao menos 15 minutos')
    }
    d.horario = this.agora + minutos * MINUTO
    d.reagendamentos++
    return ok('Envio reagendado')
  }

  cancelar (edicao) {
    const d = edicao.disparo
    if (!d || d.situacao !== 'agendado') return falha('Não há envio agendado para esta edição')
    if (this.minutosAteODisparo(edicao) < LIMITE_CANCELAMENTO_MIN) {
      return falha('O cancelamento só é permitido até 5 minutos antes do envio')
    }
    d.situacao = 'cancelado'
    return ok('Envio cancelado')
  }

  minutosAteODisparo (edicao) {
    return (edicao.disparo.horario - this.agora) / MINUTO
  }

  // =========== US04 · RN06 — descadastro e duplo opt-in ===========
  inscrever (email) {
    this.assinantes.set(email, { email, naLista: true, pedidoRetorno: null })
    if (!this.caixas.has(email)) this.caixas.set(email, [])
    return this.assinantes.get(email)
  }

  assinante (email) {
    return this.assinantes.get(email) || this.inscrever(email)
  }

  enviarEmail (email, assunto) {
    // RN06: todo e-mail traz o link de descadastro
    this.caixas.get(email).push({ assunto, linkDescadastro: true, enviadoEm: this.agora })
  }

  emailsRecebidos (email, assunto) {
    return (this.caixas.get(email) || []).filter((m) => m.assunto === assunto)
  }

  descadastrar (email) {
    const a = this.assinante(email)
    if (!a.naLista) return falha('Você já está fora da lista')
    a.naLista = false // efeito imediato
    a.pedidoRetorno = null
    this.enviarEmail(email, 'Confirmação de descadastro')
    return ok('Descadastro realizado')
  }

  pedirRetorno (email) {
    const a = this.assinante(email)
    if (a.naLista) return falha('Você já está na lista')
    a.pedidoRetorno = { pedidoEm: this.agora, usado: false }
    this.enviarEmail(email, 'Confirme seu retorno à lista')
    return ok('Enviamos um link de confirmação válido por 48 horas')
  }

  confirmarRetorno (email) {
    const a = this.assinante(email)
    const pedido = a.pedidoRetorno
    if (!pedido) return falha('Não há pedido de retorno pendente')
    if (pedido.usado) return falha('Este link já foi utilizado')
    if (this.agora - pedido.pedidoEm > VALIDADE_OPTIN_MS) return falha('Link de confirmação expirado')
    pedido.usado = true
    a.naLista = true
    return ok('Retorno à lista confirmado')
  }

  disparar (edicao) {
    const destinatarios = [...this.assinantes.values()].filter((a) => a.naLista)
    destinatarios.forEach((a) => this.enviarEmail(a.email, edicao.titulo))
    return ok(`Edição enviada para ${destinatarios.length} assinante(s)`)
  }
}

module.exports = { Servico, Edicao, SITUACAO, SEGUNDO, MINUTO, HORA }
```
