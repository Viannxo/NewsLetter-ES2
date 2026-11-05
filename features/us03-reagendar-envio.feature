# language: pt
@US03
Funcionalidade: Reagendar envio
  Como gestora de comunicação
  Quero mudar o horário de um envio já agendado
  Para acompanhar mudanças de última hora sem refazer a edição

  Contexto:
    Dado que estou autenticada como gestora
    E que existe a edição "Informativo #42" aprovada
    E que o envio está agendado para daqui a 60 minutos

  @feliz
  Cenário: Reagendar pela primeira vez
    Quando reagendo o envio para daqui a 120 minutos
    Então o disparo deve estar agendado para daqui a 120 minutos
    E devo ver a mensagem "Envio reagendado"

  @excecao
  Cenário: Reagendar para menos de 15 minutos é recusado
    Quando reagendo o envio para daqui a 10 minutos
    Então o disparo deve continuar agendado para daqui a 60 minutos
    E devo ver a mensagem "O envio precisa de ao menos 15 minutos"

  @limite
  Esquema do Cenário: Limite de 2 reagendamentos
    Dado que o envio já foi reagendado <vezes>
    Quando reagendo o envio para daqui a 120 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | vezes   | mensagem                               |
      | 0 vezes | Envio reagendado                       |
      | 1 vez   | Envio reagendado                       |
      | 2 vezes | O envio só pode ser reagendado 2 vezes |
