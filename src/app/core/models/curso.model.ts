import { Categoria } from './categoria.model';

export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  categoria: Categoria;
  cargaHoraria: number;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  thumbnail: string;
  status: 'ATIVO' | 'INATIVO' | 'EM_ELABORACAO';
  dataCadastro: string;
}
