export interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  foto: string;
  status: 'ATIVO' | 'INATIVO' | 'SUSPENSO';
  nivelProgresso: number;
  dataCadastro: string;
  emergenciaNome: string;
  emergenciaTelefone: string;
  emergenciaParentesco: string;
}
