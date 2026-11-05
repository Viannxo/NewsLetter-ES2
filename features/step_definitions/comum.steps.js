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
