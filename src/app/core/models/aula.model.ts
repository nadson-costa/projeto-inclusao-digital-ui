export interface Aula {
  id: number;
  titulo: string;
  descricao: string;
  cursoId: number;
  cursoNome: string;
  ordem: number;
  formato: 'VIDEO' | 'TEXTO_IMAGENS' | 'SIMULACAO_INTERATIVA';
  conteudo: string;
  duracao: number;
  status: 'ATIVA' | 'INATIVA' | 'EM_ELABORACAO';
}
