# US02 · Aprovar edição para envio

**Dupla:** Eduardo Vianna Meira (844387) · Vitor Alexandre (803371)  
NewsFlow (Vértice) · BDD com Cucumber.js · projeto organizado como no CucumberStudio (pasta da história → features → cenários, action words reutilizáveis e datasets nos esquemas).  
**Resultado da execução (`npx cucumber-js --tags @US02`):** 11 cenários e 63 passos, todos passando.

## 1. História de usuário

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

## 2. Features e cenários

São 3 features, com 3 cenários cada (os esquemas são expandidos pelo dataset de Exemplos).

- **Feature 1: Aprovar edição** (`features/us02-aprovar-edicao.feature`)
  - `@feliz` Cenário: Revisor aprova a edição de outra pessoa
  - `@excecao` Cenário: Autora não pode aprovar a própria edição
  - `@excecao` Cenário: Quem não é revisor não pode aprovar
- **Feature 2: Reprovar edição com comentário** (`features/us02-reprovar-edicao.feature`)
  - `@feliz` Cenário: Reprovar com comentário devolve a edição ao rascunho
  - `@excecao` Cenário: Reprovar sem comentário é recusado
  - `@excecao` Cenário: Edição já aprovada não pode ser reprovada
- **Feature 3: Envio exige aprovação de um revisor** (`features/us02-envio-exige-aprovacao.feature`)
  - `@feliz` Cenário: Edição aprovada pode ser agendada
  - `@excecao` Cenário: Edição reprovada não pode ser agendada
  - `@limite` Esquema do Cenário: Só a situação "aprovada" libera o agendamento (dataset com 3 exemplos)

## 3. Gherkin

### Feature 1 · Aprovar edição

```gherkin
# language: pt
@US02
Funcionalidade: Aprovar edição
  Como revisor
  Quero aprovar uma edição escrita por outra pessoa
  Para liberar o envio sem virar gargalo

  Contexto:
    Dado que a edição "Informativo #42" foi escrita pela redatora "Carla"
    E que a edição está aguardando revisão

  @feliz
  Cenário: Revisor aprova a edição de outra pessoa
    Dado que estou autenticado como revisor "Rafael"
    Quando aprovo a edição
    Então a edição deve estar "aprovada"
    E devo ver a mensagem "Edição aprovada"

  @excecao
  Cenário: Autora não pode aprovar a própria edição
    Dado que estou autenticada como revisora "Carla"
    Quando aprovo a edição
    Então a edição deve continuar "aguardando revisão"
    E devo ver a mensagem "O autor não pode aprovar a própria edição"

  @excecao
  Cenário: Quem não é revisor não pode aprovar
    Dado que estou autenticada como redatora "Beatriz"
    Quando aprovo a edição
    Então a edição deve continuar "aguardando revisão"
    E devo ver a mensagem "Somente revisores podem aprovar edições"
```

### Feature 2 · Reprovar edição com comentário

```gherkin
# language: pt
@US02
Funcionalidade: Reprovar edição com comentário
  Como revisor
  Quero devolver a edição ao rascunho explicando o que corrigir
  Para que a redatora saiba exatamente o que mudar sem precisar me procurar

  Contexto:
    Dado que a edição "Informativo #42" foi escrita pela redatora "Carla"
    E que estou autenticado como revisor "Rafael"

  @feliz
  Cenário: Reprovar com comentário devolve a edição ao rascunho
    Dado que a edição está aguardando revisão
    Quando reprovo a edição com o comentário "Corrigir o link da oferta"
    Então a edição deve estar "em rascunho"
    E a redatora "Carla" deve ver o comentário "Corrigir o link da oferta"

  @excecao
  Cenário: Reprovar sem comentário é recusado
    Dado que a edição está aguardando revisão
    Quando reprovo a edição sem comentário
    Então a edição deve continuar "aguardando revisão"
    E devo ver a mensagem "O comentário é obrigatório para reprovar"

  @excecao
  Cenário: Edição já aprovada não pode ser reprovada
    Dado que a edição foi aprovada pelo revisor "Paula"
    Quando reprovo a edição com o comentário "Trocar a imagem de capa"
    Então a edição deve continuar "aprovada"
    E devo ver a mensagem "A edição não está aguardando revisão"
```

### Feature 3 · Envio exige aprovação de um revisor

```gherkin
# language: pt
@US02
Funcionalidade: Envio exige aprovação de um revisor
  Como gestora de comunicação
  Quero que só edições aprovadas possam ser agendadas
  Para nunca disparar para 40 mil assinantes um texto que ninguém conferiu

  Contexto:
    Dado que a edição "Informativo #42" foi escrita pela redatora "Carla"
    E que estou autenticada como gestora

  @feliz
  Cenário: Edição aprovada pode ser agendada
    Dado que a edição foi aprovada pelo revisor "Rafael"
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo deve estar agendado para daqui a 30 minutos
    E devo ver a mensagem "Envio agendado"

  @excecao
  Cenário: Edição reprovada não pode ser agendada
    Dado que a edição foi reprovada pelo revisor "Rafael" com o comentário "Revisar o título"
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo não deve estar agendado
    E devo ver a mensagem "A edição precisa ser aprovada por um revisor"

  @limite
  Esquema do Cenário: Só a situação "aprovada" libera o agendamento
    Dado que a edição está "<situacao>"
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | situacao           | mensagem                                     |
      | em rascunho        | A edição precisa ser aprovada por um revisor |
      | aguardando revisão | A edição precisa ser aprovada por um revisor |
      | aprovada           | Envio agendado                               |
```

## 4. Action words (passos reutilizáveis)

**Dado:**

- `que a edição "{titulo}" foi escrita pela redatora "{autora}"` — String, String
- `que a edição está aguardando revisão`
- `que a edição está "{situacao}"` — String
- `que estou autenticado/autenticada como revisor/revisora "{nome}"` — String
- `que estou autenticada como redatora "{nome}"` — String
- `que a edição foi aprovada pelo revisor "{revisor}"` — String
- `que a edição foi reprovada pelo revisor "{revisor}" com o comentário "{comentario}"` — String, String

**Quando:**

- `aprovo a edição`
- `reprovo a edição com o comentário "{comentario}"` — String
- `reprovo a edição sem comentário`

**Então:**

- `a edição deve estar "{situacao}"` — String
- `a edição deve continuar "{situacao}"` — String
- `a redatora "{autora}" deve ver o comentário "{comentario}"` — String, String

**Reutilizadas de outras histórias / comuns:**

- `que estou autenticada como gestora` — comum.steps.js
- `devo ver a mensagem "{mensagem}"` — comum.steps.js
- `agendo o envio para daqui a {minutos} minutos` — US03
- `o disparo deve estar agendado para daqui a {minutos} minutos` — US03
- `o disparo não deve estar agendado` — US03

Observação: o Cucumber diferencia Dado de Quando; por isso uma ação usada como pré-condição (ex.: "que insiro o texto") também existe como `Given`.

## 5. Código JavaScript (Cucumber.js)

### features/step_definitions/us02-aprovar-edicao.steps.js

Steps da história. O estado fica no World (`this`), recriado a cada cenário; o domínio em memória e o relógio simulado (sem `sleep`) estão em `features/support/dominio.js` e `features/support/world.js` (seção 6).

```javascript
// =====================================================================
// US02 · Aprovar edição para envio (RN02)
// =====================================================================
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')
const { SITUACAO } = require('../support/dominio')

// Executa uma ação como outro usuário e devolve a sessão a quem estava logado
function comoRevisor (mundo, nome, acao) {
  const sessaoAnterior = mundo.servico.usuario
  mundo.servico.autenticar('revisor', nome)
  const resultado = acao()
  mundo.servico.usuario = sessaoAnterior
  assert.ok(resultado.ok, resultado.mensagem)
}

// ---------------------------- DADO ----------------------------
Given('que a edição {string} foi escrita pela redatora {string}', function (titulo, autora) {
  this.edicao = this.servico.criarEdicao(titulo, 'Novidades da semana', autora)
})

Given('que a edição está aguardando revisão', function () {
  this.servico.enviarParaRevisao(this.edicao)
})

Given('que a edição está {string}', function (situacao) {
  assert.ok(Object.values(SITUACAO).includes(situacao), `Situação desconhecida: ${situacao}`)
  this.edicao.situacao = situacao
})

Given('que estou autenticado/autenticada como revisor/revisora {string}', function (nome) {
  this.servico.autenticar('revisor', nome)
})

Given('que estou autenticada como redatora {string}', function (nome) {
  this.servico.autenticar('redatora', nome)
})

Given('que a edição foi aprovada pelo revisor {string}', function (revisor) {
  this.servico.enviarParaRevisao(this.edicao)
  comoRevisor(this, revisor, () => this.servico.aprovar(this.edicao))
})

Given('que a edição foi reprovada pelo revisor {string} com o comentário {string}', function (revisor, comentario) {
  this.servico.enviarParaRevisao(this.edicao)
  comoRevisor(this, revisor, () => this.servico.reprovar(this.edicao, comentario))
})

// ---------------------------- QUANDO ----------------------------
When('aprovo a edição', function () {
  this.resultado = this.servico.aprovar(this.edicao)
})

When('reprovo a edição com o comentário {string}', function (comentario) {
  this.resultado = this.servico.reprovar(this.edicao, comentario)
})

When('reprovo a edição sem comentário', function () {
  this.resultado = this.servico.reprovar(this.edicao, '')
})

// ---------------------------- ENTÃO ----------------------------
Then('a edição deve estar {string}', function (situacao) {
  assert.equal(this.edicao.situacao, situacao)
})

Then('a edição deve continuar {string}', function (situacao) {
  assert.equal(this.edicao.situacao, situacao)
})

Then('a redatora {string} deve ver o comentário {string}', function (autora, comentario) {
  assert.equal(this.edicao.autor, autora)
  assert.ok(
    this.edicao.comentarios.some((c) => c.texto === comentario),
    `Comentário "${comentario}" não encontrado na edição`
  )
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
