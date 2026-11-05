# language: pt
@US01
Funcionalidade: Inserir texto na edição
  Como redatora
  Quero inserir texto no corpo da edição
  Para começar a escrever a newsletter sem perder o que já escrevi

  Contexto:
    Dado que estou autenticada como redatora
    E que existe a edição "Informativo #43" em rascunho com o corpo vazio

  @feliz
  Cenário: Inserir texto no corpo vazio
    Quando insiro o texto "Olá, assinantes da Vértice!"
    Então o corpo da edição deve ser "Olá, assinantes da Vértice!"

  @excecao
  Cenário: Inserir texto em branco
    Quando insiro o texto "   "
    Então o corpo da edição deve continuar vazio
    E devo ver a mensagem "Digite algum texto para inserir"

  @limite
  Esquema do Cenário: Texto inserido é salvo após 30 segundos sem digitar
    Dado que insiro o texto "Primeiro parágrafo"
    Quando eu espero <segundos> segundos sem digitar
    Então o rascunho deve ter <versoes> versões salvas

    Exemplos:
      | segundos | versoes |
      | 29       | 0       |
      | 30       | 1       |
      | 60       | 1       |
