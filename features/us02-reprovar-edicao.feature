# language: pt
@US02
Funcionalidade: Reprovar edição com comentário
  Como revisor
  Quero devolver a edição ao rascunho explicando o que corrigir
  Para que a redatora saiba exatamente o que mudar sem precisar me procurar

  Contexto:
    Dado que a edição "Informativo #42" foi escrita pela redatora "Carla"
    E que estou autenticado como revisor "Rafael"

  @feliz
  Cenário: Reprovar com comentário devolve a edição ao rascunho
    Dado que a edição está aguardando revisão
    Quando reprovo a edição com o comentário "Corrigir o link da oferta"
    Então a edição deve estar "em rascunho"
    E a redatora "Carla" deve ver o comentário "Corrigir o link da oferta"

  @excecao
  Cenário: Reprovar sem comentário é recusado
    Dado que a edição está aguardando revisão
    Quando reprovo a edição sem comentário
    Então a edição deve continuar "aguardando revisão"
    E devo ver a mensagem "O comentário é obrigatório para reprovar"

  @excecao
  Cenário: Edição já aprovada não pode ser reprovada
    Dado que a edição foi aprovada pelo revisor "Paula"
    Quando reprovo a edição com o comentário "Trocar a imagem de capa"
    Então a edição deve continuar "aprovada"
    E devo ver a mensagem "A edição não está aguardando revisão"
