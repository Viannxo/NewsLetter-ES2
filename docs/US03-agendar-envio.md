# US03 · Agendar envio

**Dupla:** Eduardo Vianna Meira (844387) · Vitor Alexandre (803371)  
NewsFlow (Vértice) · BDD com Cucumber.js · projeto organizado como no CucumberStudio (pasta da história → features → cenários, action words reutilizáveis e datasets nos esquemas).  
**Resultado da execução (`npx cucumber-js --tags @US03`):** 17 cenários e 93 passos, todos passando.

## 1. História de usuário

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

## 2. Features e cenários

São 3 features, com 3 cenários cada (os esquemas são expandidos pelo dataset de Exemplos).

- **Feature 1: Agendar envio de newsletter** (`features/us03-agendar-envio.feature`)
  - `@feliz` Cenário: Agendamento com antecedência suficiente
  - `@excecao` Cenário: Agendamento com menos de 15 minutos é recusado
  - `@limite` Esquema do Cenário: Antecedência mínima de 15 minutos para agendar (dataset com 5 exemplos)
- **Feature 2: Reagendar envio** (`features/us03-reagendar-envio.feature`)
  - `@feliz` Cenário: Reagendar pela primeira vez
  - `@excecao` Cenário: Reagendar para menos de 15 minutos é recusado
  - `@limite` Esquema do Cenário: Limite de 2 reagendamentos (dataset com 3 exemplos)
- **Feature 3: Cancelar envio agendado** (`features/us03-cancelar-envio.feature`)
  - `@feliz` Cenário: Cancelar com antecedência
  - `@excecao` Cenário: Cancelar faltando menos de 5 minutos é recusado
  - `@limite` Esquema do Cenário: Cancelamento permitido até 5 minutos antes (dataset com 3 exemplos)

## 3. Gherkin

### Feature 1 · Agendar envio de newsletter

```gherkin
# language: pt
@US03
Funcionalidade: Agendar envio de newsletter
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada
  Para que ela chegue no melhor horário sem eu precisar apertar o botão

  Contexto:
    Dado que estou autenticada como gestora
    E que existe a edição "Informativo #42" aprovada

  @feliz
  Cenário: Agendamento com antecedência suficiente
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo deve estar agendado para daqui a 30 minutos
    E o disparo deve usar o fuso "America/Sao_Paulo"
    E devo ver a mensagem "Envio agendado"

  @excecao
  Cenário: Agendamento com menos de 15 minutos é recusado
    Quando agendo o envio para daqui a 10 minutos
    Então o disparo não deve estar agendado
    E devo ver a mensagem "O envio precisa de ao menos 15 minutos"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos para agendar
    Quando agendo o envio para daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                               |
      | 60      | Envio agendado                         |
      | 16      | Envio agendado                         |
      | 15      | Envio agendado                         |
      | 14      | O envio precisa de ao menos 15 minutos |
      | 0       | O envio precisa de ao menos 15 minutos |
```

### Feature 2 · Reagendar envio

```gherkin
# language: pt
@US03
Funcionalidade: Reagendar envio
  Como gestora de comunicação
  Quero mudar o horário de um envio já agendado
  Para acompanhar mudanças de última hora sem refazer a edição

  Contexto:
    Dado que estou autenticada como gestora
    E que existe a edição "Informativo #42" aprovada
    E que o envio está agendado para daqui a 60 minutos

  @feliz
  Cenário: Reagendar pela primeira vez
    Quando reagendo o envio para daqui a 120 minutos
    Então o disparo deve estar agendado para daqui a 120 minutos
    E devo ver a mensagem "Envio reagendado"

  @excecao
  Cenário: Reagendar para menos de 15 minutos é recusado
    Quando reagendo o envio para daqui a 10 minutos
    Então o disparo deve continuar agendado para daqui a 60 minutos
    E devo ver a mensagem "O envio precisa de ao menos 15 minutos"

  @limite
  Esquema do Cenário: Limite de 2 reagendamentos
    Dado que o envio já foi reagendado <vezes>
    Quando reagendo o envio para daqui a 120 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | vezes   | mensagem                               |
      | 0 vezes | Envio reagendado                       |
      | 1 vez   | Envio reagendado                       |
      | 2 vezes | O envio só pode ser reagendado 2 vezes |
```

### Feature 3 · Cancelar envio agendado

```gherkin
# language: pt
@US03
Funcionalidade: Cancelar envio agendado
  Como gestora de comunicação
  Quero cancelar um envio que não deve mais sair
  Para não mandar aos assinantes uma informação que ficou errada

  Contexto:
    Dado que estou autenticada como gestora
    E que existe a edição "Informativo #42" aprovada
    E que o envio está agendado para daqui a 60 minutos

  @feliz
  Cenário: Cancelar com antecedência
    Dado que faltam 30 minutos para o envio
    Quando cancelo o envio
    Então o disparo deve estar cancelado
    E devo ver a mensagem "Envio cancelado"

  @excecao
  Cenário: Cancelar faltando menos de 5 minutos é recusado
    Dado que faltam 2 minutos para o envio
    Quando cancelo o envio
    Então o disparo deve continuar agendado
    E devo ver a mensagem "O cancelamento só é permitido até 5 minutos antes do envio"

  @limite
  Esquema do Cenário: Cancelamento permitido até 5 minutos antes
    Dado que faltam <minutos> minutos para o envio
    Quando cancelo o envio
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                                                   |
      | 6       | Envio cancelado                                            |
      | 5       | Envio cancelado                                            |
      | 4       | O cancelamento só é permitido até 5 minutos antes do envio |
```

## 4. Action words (passos reutilizáveis)

**Dado:**

- `que existe a edição "{titulo}" aprovada` — String
- `que o envio está agendado para daqui a {minutos} minutos` — Integer
- `que o envio já foi reagendado {vezes} vez(es)` — Integer
- `que faltam {minutos} minutos para o envio` — Integer

**Quando:**

- `agendo o envio para daqui a {minutos} minutos` — Integer
- `reagendo o envio para daqui a {minutos} minutos` — Integer
- `cancelo o envio`

**Então:**

- `o disparo deve estar agendado para daqui a {minutos} minutos` — Integer
- `o disparo deve continuar agendado para daqui a {minutos} minutos` — Integer
- `o disparo deve usar o fuso "{fuso}"` — String
- `o disparo não deve estar agendado`
- `o disparo deve estar cancelado`
- `o disparo deve continuar agendado`

**Reutilizadas de outras histórias / comuns:**

- `que estou autenticada como gestora` — comum.steps.js
- `devo ver a mensagem "{mensagem}"` — comum.steps.js

Observação: o Cucumber diferencia Dado de Quando; por isso uma ação usada como pré-condição (ex.: "que insiro o texto") também existe como `Given`.

## 5. Código JavaScript (Cucumber.js)

### features/step_definitions/us03-agendar-envio.steps.js

Steps da história. O estado fica no World (`this`), recriado a cada cenário; o domínio em memória e o relógio simulado (sem `sleep`) estão em `features/support/dominio.js` e `features/support/world.js` (seção 6).

```javascript
// =====================================================================
// US03 · Agendar envio (RN03) — agendar, reagendar e cancelar
// =====================================================================
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')
const { SITUACAO, MINUTO } = require('../support/dominio')

// ---------------------------- DADO ----------------------------
Given('que existe a edição {string} aprovada', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, 'Novidades da semana', 'Carla')
  this.edicao.situacao = SITUACAO.APROVADA
  this.edicao.aprovadaPor = 'Rafael'
})

Given('que o envio está agendado para daqui a {int} minutos', function (minutos) {
  const r = this.servico.agendar(this.edicao, minutos)
  assert.ok(r.ok, r.mensagem)
})

Given('que o envio já foi reagendado {int} vez(es)', function (vezes) {
  this.edicao.disparo.reagendamentos = vezes
})

Given('que faltam {int} minutos para o envio', function (minutos) {
  const faltamAgora = this.servico.minutosAteODisparo(this.edicao)
  this.avancarMinutos(faltamAgora - minutos)
})

// ---------------------------- QUANDO ----------------------------
When('agendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.agendar(this.edicao, minutos)
})

When('reagendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.reagendar(this.edicao, minutos)
})

When('cancelo o envio', function () {
  this.resultado = this.servico.cancelar(this.edicao)
})

// ---------------------------- ENTÃO ----------------------------
function assertAgendadoPara (mundo, minutos) {
  const d = mundo.edicao.disparo
  assert.ok(d, 'O disparo não foi agendado')
  assert.equal(d.situacao, 'agendado')
  assert.equal(d.horario, mundo.servico.agora + minutos * MINUTO)
}

Then('o disparo deve estar agendado para daqui a {int} minutos', function (minutos) {
  assertAgendadoPara(this, minutos)
})

Then('o disparo deve continuar agendado para daqui a {int} minutos', function (minutos) {
  assertAgendadoPara(this, minutos)
})

Then('o disparo deve usar o fuso {string}', function (fuso) {
  assert.equal(this.edicao.disparo.fuso, fuso)
})

Then('o disparo não deve estar agendado', function () {
  assert.equal(this.edicao.disparo, null)
})

Then('o disparo deve estar cancelado', function () {
  assert.equal(this.edicao.disparo.situacao, 'cancelado')
})

Then('o disparo deve continuar agendado', function () {
  assert.equal(this.edicao.disparo.situacao, 'agendado')
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
