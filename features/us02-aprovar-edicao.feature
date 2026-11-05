# language: pt
@US02
Funcionalidade: Aprovar edição
  Como revisor
  Quero aprovar uma edição escrita por outra pessoa
  Para liberar o envio sem virar gargalo

  Contexto:
    Dado que a edição "Informativo #42" foi escrita pela redatora "Carla"
    E que a edição está aguardando revisão

  @feliz
  Cenário: Revisor aprova a edição de outra pessoa
    Dado que estou autenticado como revisor "Rafael"
    Quando aprovo a edição
    Então a edição deve estar "aprovada"
    E devo ver a mensagem "Edição aprovada"

  @excecao
  Cenário: Autora não pode aprovar a própria edição
    Dado que estou autenticada como revisora "Carla"
    Quando aprovo a edição
    Então a edição deve continuar "aguardando revisão"
    E devo ver a mensagem "O autor não pode aprovar a própria edição"

  @excecao
  Cenário: Quem não é revisor não pode aprovar
    Dado que estou autenticada como redatora "Beatriz"
    Quando aprovo a edição
    Então a edição deve continuar "aguardando revisão"
    E devo ver a mensagem "Somente revisores podem aprovar edições"
