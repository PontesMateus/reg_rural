export const ErrorMessages = {
  AUTH: {
    CREDENCIAIS_INVALIDAS: 'Credenciais inválidas.',
    TOKEN_EXPIRADO: 'Token expirado',
    TOKEN_INVALIDO: 'Token inválido'
  },
  FAZENDA: {
    VALIDA_AREA: 'A área total não pode ser menor que a soma das áreas agrícola e de vegetação.',
    VALIDA_ATUALIZA_AREA: 'Se for atualizar qualquer área, as três áreas (total, agrícola e vegetação) devem ser informadas.',
  },
  GERAL: {
    ERRO_PADRAO: 'Houve um problema com a requisição, tente novamente mais tarde.',
    FORBIDDEN: 'Acesso negado.',
  },
  PRODUTOR: {
    CPF_CADASTRADO: 'CPF já cadastrado',
    CNPJ_CADASTRADO: 'CNPJ já cadastrado',
    CPF_INVALIDO: 'O CPF Informado é inválido.',
    CNPJ_INVALIDO: 'O CNPJ Informado é inválido.',
    DOCUMENTO_REQUERIDO: 'Para cadastrar um produtor é necessário o mínimo de um documento válido (CPF e/ou CNPJ).'
  },
  USUARIO: {
    NAO_ENCONTRADO: 'Usuário não encontrado.',
    EMAIL_CADASTRADO: 'E-mail já cadastrado',
  },
};