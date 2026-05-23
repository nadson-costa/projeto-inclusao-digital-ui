export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  icone: string;
  status: 'ATIVA' | 'INATIVA';
}
