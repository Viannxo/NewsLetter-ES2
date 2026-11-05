# language: pt
@US04
Funcionalidade: Disparo respeita o descadastro
  Como assinante
  Quero ter certeza de que, depois de sair, não recebo mais nada
  Para confiar que o descadastro funciona de verdade

  Contexto:
    Dado que existe a edição "Informativo #42" aprovada
    E que a assinante "ana@exemplo.com" está na lista

  @feliz
  Cenário: Quem está na lista recebe a edição
    Quando a edição "Informativo #42" é disparada
    Então a assinante "ana@exemplo.com" deve receber a edição "Informativo #42"

  @excecao
  Cenário: Quem se descadastrou não recebe a edição
    Dado que a assinante "bia@exemplo.com" se descadastrou
    Quando a edição "Informativo #42" é disparada
    Então a assinante "bia@exemplo.com" não deve receber a edição "Informativo #42"
    E a assinante "ana@exemplo.com" deve receber a edição "Informativo #42"

  @excecao
  Cenário: Retorno ainda não confirmado não volta a receber
    Dado que a assinante "bia@exemplo.com" se descadastrou
    E que a assinante "bia@exemplo.com" pediu para voltar à lista há 1 hora
    Quando a edição "Informativo #42" é disparada
    Então a assinante "bia@exemplo.com" não deve receber a edição "Informativo #42"
