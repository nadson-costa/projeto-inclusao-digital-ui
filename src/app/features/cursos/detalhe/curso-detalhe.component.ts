import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Curso } from '../../../core/models/curso.model';
import { Aula } from '../../../core/models/aula.model';
import { CursoService } from '../cursos.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-curso-detalhe',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, LoadingComponent],
  templateUrl: './curso-detalhe.component.html'
})
export default class CursoDetalheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cursoService = inject(CursoService);

  curso = signal<Curso | null>(null);
  aulas = signal<Aula[]>([]);
  loading = signal(true);
  erro = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.router.navigate(['/cursos']);
      return;
    }

    forkJoin({
      curso: this.cursoService.buscarPorId(id),
      aulas: this.cursoService.listarAulas(id)
    }).subscribe({
      next: ({ curso, aulas }) => {
        this.curso.set(curso);
        this.aulas.set([...aulas].sort((a, b) => a.ordem - b.ordem));
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.loading.set(false);
      }
    });
  }

  formatoDaAula(formato: Aula['formato']): string {
    const map: Record<Aula['formato'], string> = {
      VIDEO: 'Vídeo',
      TEXTO_IMAGENS: 'Leitura',
      SIMULACAO_INTERATIVA: 'Simulação'
    };
    return map[formato];
  }
}
