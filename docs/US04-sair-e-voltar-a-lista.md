# US04 · Sair e voltar à lista

**Dupla:** Eduardo Vianna Meira (844387) · Vitor Alexandre (803371)  
NewsFlow (Vértice) · BDD com Cucumber.js · projeto organizado como no CucumberStudio (pasta da história → features → cenários, action words reutilizáveis e datasets nos esquemas).  
**Resultado da execução (`npx cucumber-js --tags @US04`):** 11 cenários e 53 passos, todos passando.

## 1. História de usuário

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

## 2. Features e cenários

São 3 features, com 3 cenários cada (os esquemas são expandidos pelo dataset de Exemplos).

- **Feature 1: Descadastrar pelo link do e-mail** (`features/us04-descadastrar.feature`)
  - `@feliz` Cenário: Descadastro tem efeito imediato e é confirmado por e-mail
  - `@excecao` Cenário: Quem já saiu da lista não é descadastrado de novo
  - `@feliz` Cenário: Toda newsletter traz o link de descadastro
- **Feature 2: Voltar à lista com duplo opt-in** (`features/us04-voltar-a-lista.feature`)
  - `@feliz` Cenário: Pedido de retorno envia link de confirmação e ainda não reinscreve
  - `@excecao` Cenário: Link de confirmação não pode ser usado duas vezes
  - `@limite` Esquema do Cenário: Link de confirmação vale por 48 horas (dataset com 3 exemplos)
- **Feature 3: Disparo respeita o descadastro** (`features/us04-disparo-respeita-descadastro.feature`)
  - `@feliz` Cenário: Quem está na lista recebe a edição
  - `@excecao` Cenário: Quem se descadastrou não recebe a edição
  - `@excecao` Cenário: Retorno ainda não confirmado não volta a receber

## 3. Gherkin

### Feature 1 · Descadastrar pelo link do e-mail

```gherkin
# language: pt
@US04
Funcionalidade: Descadastrar pelo link do e-mail
  Como assinante
  Quero sair da lista pelo link que vem em todo e-mail
  Para parar de receber newsletters na hora em que eu decidir

  Contexto:
    Dado que a assinante "ana@exemplo.com" está na lista

  @feliz
  Cenário: Descadastro tem efeito imediato e é confirmado por e-mail
    Quando a assinante "ana@exemplo.com" se descadastra pelo link do e-mail
    Então a assinante "ana@exemplo.com" deve estar fora da lista
    E a assinante "ana@exemplo.com" deve receber o e-mail "Confirmação de descadastro"

  @excecao
  Cenário: Quem já saiu da lista não é descadastrado de novo
    Dado que a assinante "ana@exemplo.com" se descadastrou
    Quando a assinante "ana@exemplo.com" se descadastra pelo link do e-mail
    Então devo ver a mensagem "Você já está fora da lista"
    E a assinante "ana@exemplo.com" deve ter recebido 1 e-mail "Confirmação de descadastro"

  @feliz
  Cenário: Toda newsletter traz o link de descadastro
    Dado que existe a edição "Informativo #42" aprovada
    Quando a edição "Informativo #42" é disparada
    Então o e-mail "Informativo #42" recebido por "ana@exemplo.com" deve trazer o link de descadastro
```

### Feature 2 · Voltar à lista com duplo opt-in

```gherkin
# language: pt
@US04
Funcionalidade: Voltar à lista com duplo opt-in
  Como assinante que saiu da lista
  Quero voltar a receber as newsletters confirmando pelo meu e-mail
  Para que ninguém consiga me inscrever de volta sem o meu consentimento

  Contexto:
    Dado que a assinante "ana@exemplo.com" se descadastrou

  @feliz
  Cenário: Pedido de retorno envia link de confirmação e ainda não reinscreve
    Quando a assinante "ana@exemplo.com" pede para voltar à lista
    Então a assinante "ana@exemplo.com" deve receber o e-mail "Confirme seu retorno à lista"
    E a assinante "ana@exemplo.com" deve continuar fora da lista

  @excecao
  Cenário: Link de confirmação não pode ser usado duas vezes
    Dado que a assinante "ana@exemplo.com" pediu para voltar à lista há 1 hora
    E que a assinante "ana@exemplo.com" já confirmou o retorno
    Quando a assinante "ana@exemplo.com" confirma o retorno pelo link
    Então devo ver a mensagem "Este link já foi utilizado"

  @limite
  Esquema do Cenário: Link de confirmação vale por 48 horas
    Dado que a assinante "ana@exemplo.com" pediu para voltar à lista há <horas> horas
    Quando a assinante "ana@exemplo.com" confirma o retorno pelo link
    Então devo ver a mensagem "<mensagem>"
    E a assinante "ana@exemplo.com" deve <situacao>

    Exemplos:
      | horas | mensagem                     | situacao                |
      | 47    | Retorno à lista confirmado   | estar na lista          |
      | 48    | Retorno à lista confirmado   | estar na lista          |
      | 49    | Link de confirmação expirado | continuar fora da lista |
```

### Feature 3 · Disparo respeita o descadastro

```gherkin
# language: pt
@US04
Funcionalidade: Disparo respeita o descadastro
  Como assinante
  Quero ter certeza de que, depois de sair, não recebo mais nada
  Para confiar que o descadastro funciona de verdade

  Contexto:
    Dado que existe a edição "Informativo #42" aprovada
    E que a assinante "ana@exemplo.com" está na lista

  @feliz
  Cenário: Quem está na lista recebe a edição
    Quando a edição "Informativo #42" é disparada
    Então a assinante "ana@exemplo.com" deve receber a edição "Informativo #42"

  @excecao
  Cenário: Quem se descadastrou não recebe a edição
    Dado que a assinante "bia@exemplo.com" se descadastrou
    Quando a edição "Informativo #42" é disparada
    Então a assinante "bia@exemplo.com" não deve receber a edição "Informativo #42"
    E a assinante "ana@exemplo.com" deve receber a edição "Informativo #42"

  @excecao
  Cenário: Retorno ainda não confirmado não volta a receber
    Dado que a assinante "bia@exemplo.com" se descadastrou
    E que a assinante "bia@exemplo.com" pediu para voltar à lista há 1 hora
    Quando a edição "Informativo #42" é disparada
    Então a assinante "bia@exemplo.com" não deve receber a edição "Informativo #42"
```

## 4. Action words (passos reutilizáveis)

**Dado:**

- `que a assinante "{email}" está na lista` — String
- `que a assinante "{email}" se descadastrou` — String
- `que a assinante "{email}" pediu para voltar à lista há {horas} hora(s)` — String, Integer
- `que a assinante "{email}" já confirmou o retorno` — String

**Quando:**

- `a assinante "{email}" se descadastra pelo link do e-mail` — String
- `a assinante "{email}" pede para voltar à lista` — String
- `a assinante "{email}" confirma o retorno pelo link` — String
- `a edição "{titulo}" é disparada` — String

**Então:**

- `a assinante "{email}" deve estar na lista` — String
- `a assinante "{email}" deve estar fora da lista` — String
- `a assinante "{email}" deve continuar fora da lista` — String
- `a assinante "{email}" deve receber o e-mail "{assunto}"` — String, String
- `a assinante "{email}" deve ter recebido {quantidade} e-mail(s) "{assunto}"` — String, Integer, String
- `a assinante "{email}" deve receber a edição "{titulo}"` — String, String
- `a assinante "{email}" não deve receber a edição "{titulo}"` — String, String
- `o e-mail "{assunto}" recebido por "{email}" deve trazer o link de descadastro` — String, String

**Reutilizadas de outras histórias / comuns:**

- `que existe a edição "{titulo}" aprovada` — US03
- `devo ver a mensagem "{mensagem}"` — comum.steps.js

Observação: o Cucumber diferencia Dado de Quando; por isso uma ação usada como pré-condição (ex.: "que insiro o texto") também existe como `Given`.

## 5. Código JavaScript (Cucumber.js)

### features/step_definitions/us04-descadastro.steps.js

Steps da história. O estado fica no World (`this`), recriado a cada cenário; o domínio em memória e o relógio simulado (sem `sleep`) estão em `features/support/dominio.js` e `features/support/world.js` (seção 6).

```javascript
// =====================================================================
// US04 · Sair e voltar à lista (RN06) — descadastro e duplo opt-in
// =====================================================================
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// ---------------------------- DADO ----------------------------
Given('que a assinante {string} está na lista', function (email) {
  this.servico.inscrever(email)
})

Given('que a assinante {string} se descadastrou', function (email) {
  const r = this.servico.descadastrar(email)
  assert.ok(r.ok, r.mensagem)
})

Given('que a assinante {string} pediu para voltar à lista há {int} hora(s)', function (email, horas) {
  const r = this.servico.pedirRetorno(email)
  assert.ok(r.ok, r.mensagem)
  this.avancarHoras(horas)
})

Given('que a assinante {string} já confirmou o retorno', function (email) {
  const r = this.servico.confirmarRetorno(email)
  assert.ok(r.ok, r.mensagem)
})

// ---------------------------- QUANDO ----------------------------
When('a assinante {string} se descadastra pelo link do e-mail', function (email) {
  this.resultado = this.servico.descadastrar(email)
})

When('a assinante {string} pede para voltar à lista', function (email) {
  this.resultado = this.servico.pedirRetorno(email)
})

When('a assinante {string} confirma o retorno pelo link', function (email) {
  this.resultado = this.servico.confirmarRetorno(email)
})

When('a edição {string} é disparada', function (titulo) {
  assert.equal(this.edicao.titulo, titulo)
  this.resultado = this.servico.disparar(this.edicao)
})

// ---------------------------- ENTÃO ----------------------------
Then('a assinante {string} deve estar na lista', function (email) {
  assert.equal(this.servico.assinante(email).naLista, true)
})

Then('a assinante {string} deve estar fora da lista', function (email) {
  assert.equal(this.servico.assinante(email).naLista, false)
})

Then('a assinante {string} deve continuar fora da lista', function (email) {
  assert.equal(this.servico.assinante(email).naLista, false)
})

Then('a assinante {string} deve receber o e-mail {string}', function (email, assunto) {
  assert.ok(this.servico.emailsRecebidos(email, assunto).length > 0, `"${assunto}" não chegou para ${email}`)
})

Then('a assinante {string} deve ter recebido {int} e-mail(s) {string}', function (email, quantidade, assunto) {
  assert.equal(this.servico.emailsRecebidos(email, assunto).length, quantidade)
})

Then('a assinante {string} deve receber a edição {string}', function (email, titulo) {
  assert.equal(this.servico.emailsRecebidos(email, titulo).length, 1)
})

Then('a assinante {string} não deve receber a edição {string}', function (email, titulo) {
  assert.equal(this.servico.emailsRecebidos(email, titulo).length, 0)
})

Then('o e-mail {string} recebido por {string} deve trazer o link de descadastro', function (assunto, email) {
  const [mensagem] = this.servico.emailsRecebidos(email, assunto)
  assert.ok(mensagem, `"${assunto}" não chegou para ${email}`)
  assert.equal(mensagem.linkDescadastro, true)
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
