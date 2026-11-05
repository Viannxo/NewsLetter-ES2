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
