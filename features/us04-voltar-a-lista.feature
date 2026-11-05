# language: pt
@US04
Funcionalidade: Voltar à lista com duplo opt-in
  Como assinante que saiu da lista
  Quero voltar a receber as newsletters confirmando pelo meu e-mail
  Para que ninguém consiga me inscrever de volta sem o meu consentimento

  Contexto:
    Dado que a assinante "ana@exemplo.com" se descadastrou

  @feliz
  Cenário: Pedido de retorno envia link de confirmação e ainda não reinscreve
    Quando a assinante "ana@exemplo.com" pede para voltar à lista
    Então a assinante "ana@exemplo.com" deve receber o e-mail "Confirme seu retorno à lista"
    E a assinante "ana@exemplo.com" deve continuar fora da lista

  @excecao
  Cenário: Link de confirmação não pode ser usado duas vezes
    Dado que a assinante "ana@exemplo.com" pediu para voltar à lista há 1 hora
    E que a assinante "ana@exemplo.com" já confirmou o retorno
    Quando a assinante "ana@exemplo.com" confirma o retorno pelo link
    Então devo ver a mensagem "Este link já foi utilizado"

  @limite
  Esquema do Cenário: Link de confirmação vale por 48 horas
    Dado que a assinante "ana@exemplo.com" pediu para voltar à lista há <horas> horas
    Quando a assinante "ana@exemplo.com" confirma o retorno pelo link
    Então devo ver a mensagem "<mensagem>"
    E a assinante "ana@exemplo.com" deve <situacao>

    Exemplos:
      | horas | mensagem                     | situacao                |
      | 47    | Retorno à lista confirmado   | estar na lista          |
      | 48    | Retorno à lista confirmado   | estar na lista          |
      | 49    | Link de confirmação expirado | continuar fora da lista |
