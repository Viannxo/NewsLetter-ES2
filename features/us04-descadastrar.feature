# language: pt
@US04
Funcionalidade: Descadastrar pelo link do e-mail
  Como assinante
  Quero sair da lista pelo link que vem em todo e-mail
  Para parar de receber newsletters na hora em que eu decidir

  Contexto:
    Dado que a assinante "ana@exemplo.com" está na lista

  @feliz
  Cenário: Descadastro tem efeito imediato e é confirmado por e-mail
    Quando a assinante "ana@exemplo.com" se descadastra pelo link do e-mail
    Então a assinante "ana@exemplo.com" deve estar fora da lista
    E a assinante "ana@exemplo.com" deve receber o e-mail "Confirmação de descadastro"

  @excecao
  Cenário: Quem já saiu da lista não é descadastrado de novo
    Dado que a assinante "ana@exemplo.com" se descadastrou
    Quando a assinante "ana@exemplo.com" se descadastra pelo link do e-mail
    Então devo ver a mensagem "Você já está fora da lista"
    E a assinante "ana@exemplo.com" deve ter recebido 1 e-mail "Confirmação de descadastro"

  @feliz
  Cenário: Toda newsletter traz o link de descadastro
    Dado que existe a edição "Informativo #42" aprovada
    Quando a edição "Informativo #42" é disparada
    Então o e-mail "Informativo #42" recebido por "ana@exemplo.com" deve trazer o link de descadastro
