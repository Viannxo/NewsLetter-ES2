# language: pt
@US01
Funcionalidade: Remover texto e restaurar versões
  Como redatora
  Quero remover trechos do texto
  Para tirar o que não serve mais, podendo voltar atrás por uma versão salva

  Contexto:
    Dado que estou autenticada como redatora
    E que existe a edição "Informativo #43" em rascunho com o corpo "Olá, assinantes! Aproveite a oferta."

  @feliz
  Cenário: Remover um trecho do texto
    Quando removo o trecho " Aproveite a oferta."
    Então o corpo da edição deve ser "Olá, assinantes!"

  @excecao
  Cenário: Remover texto de um corpo vazio
    Dado que o corpo da edição está vazio
    Quando removo o trecho "oferta"
    Então devo ver a mensagem "Não há texto para remover"

  @limite
  Esquema do Cenário: Só as últimas 20 versões podem ser restauradas
    Dado que a edição já tem <salvas> versões salvas
    Quando restauro a versão <versao>
    Então devo ver a mensagem "<mensagem>"
    E o rascunho deve ter 20 versões salvas

    Exemplos:
      | salvas | versao | mensagem                          |
      | 20     | 1      | Versão restaurada                 |
      | 21     | 2      | Versão restaurada                 |
      | 21     | 1      | Versão indisponível para restauro |
