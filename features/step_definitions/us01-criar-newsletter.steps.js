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
