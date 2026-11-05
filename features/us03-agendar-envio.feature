# language: pt
@US03
Funcionalidade: Agendar envio de newsletter
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada
  Para que ela chegue no melhor horário sem eu precisar apertar o botão

  Contexto:
    Dado que estou autenticada como gestora
    E que existe a edição "Informativo #42" aprovada

  @feliz
  Cenário: Agendamento com antecedência suficiente
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo deve estar agendado para daqui a 30 minutos
    E o disparo deve usar o fuso "America/Sao_Paulo"
    E devo ver a mensagem "Envio agendado"

  @excecao
  Cenário: Agendamento com menos de 15 minutos é recusado
    Quando agendo o envio para daqui a 10 minutos
    Então o disparo não deve estar agendado
    E devo ver a mensagem "O envio precisa de ao menos 15 minutos"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos para agendar
    Quando agendo o envio para daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                               |
      | 60      | Envio agendado                         |
      | 16      | Envio agendado                         |
      | 15      | Envio agendado                         |
      | 14      | O envio precisa de ao menos 15 minutos |
      | 0       | O envio precisa de ao menos 15 minutos |
