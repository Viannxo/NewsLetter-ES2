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
