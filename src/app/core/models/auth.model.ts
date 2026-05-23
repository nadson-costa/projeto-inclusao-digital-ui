export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nomeCompleto: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  senha: string;
  emergenciaNome: string;
  emergenciaTelefone: string;
  emergenciaParentesco: string;
}
