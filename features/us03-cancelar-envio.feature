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
