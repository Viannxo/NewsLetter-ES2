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
