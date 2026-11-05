# language: pt
@US01
Funcionalidade: Editar texto da edição
  Como redatora
  Quero alterar o texto que já escrevi
  Para corrigir e melhorar a newsletter

  Contexto:
    Dado que estou autenticada como redatora
    E que existe a edição "Informativo #43" em rascunho com o corpo "Olá, assinantes!"

  @feliz
  Cenário: Substituir um trecho do texto
    Quando substituo "assinantes" por "leitores"
    Então o corpo da edição deve ser "Olá, leitores!"

  @excecao
  Cenário: Substituir um trecho que não existe
    Quando substituo "clientes" por "leitores"
    Então o corpo da edição deve continuar "Olá, assinantes!"
    E devo ver a mensagem "Trecho não encontrado"

  @salvamento
  Cenário: Edição gera uma nova versão numerada
    Dado que a edição já tem 1 versão salva
    E que substituo "assinantes" por "leitores"
    Quando eu espero 30 segundos sem digitar
    Então o rascunho deve ter 2 versões salvas
    E a versão 2 deve ter o corpo "Olá, leitores!"
