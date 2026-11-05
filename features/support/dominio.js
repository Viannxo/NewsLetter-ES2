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
