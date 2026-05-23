import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Curso } from '../../../core/models/curso.model';
import { Categoria } from '../../../core/models/categoria.model';
import { CursoService } from '../cursos.service';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-cursos-listagem',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, BottomNavComponent, LoadingComponent],
  templateUrl: './cursos-listagem.component.html'
})
export default class CursosListagemComponent implements OnInit {
  private readonly cursoService = inject(CursoService);

  cursos = signal<Curso[]>([]);
  categorias = signal<Categoria[]>([]);
  filtroAtivo = signal('Todos');
  termoBusca = signal('');
  loading = signal(true);
  erro = signal<string | null>(null);

  cursosFiltrados = computed(() => {
    let lista = this.cursos();
    const filtro = this.filtroAtivo();
    const termo = this.termoBusca().toLowerCase().trim();

    if (filtro !== 'Todos') {
      lista = lista.filter(c => c.categoria.nome === filtro);
    }

    if (termo) {
      lista = lista.filter(c => c.nome.toLowerCase().includes(termo));
    }

    return lista;
  });

  ngOnInit(): void {
    forkJoin({
      cursos: this.cursoService.listar(),
      categorias: this.cursoService.listarCategorias()
    }).subscribe({
      next: ({ cursos, categorias }) => {
        this.cursos.set(cursos);
        this.categorias.set(categorias);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.loading.set(false);
      }
    });
  }

  setBusca(event: Event): void {
    this.termoBusca.set((event.target as HTMLInputElement).value);
  }
}
