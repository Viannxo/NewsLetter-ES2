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
