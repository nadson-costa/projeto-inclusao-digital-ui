import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Curso } from '../../core/models/curso.model';
import { Categoria } from '../../core/models/categoria.model';
import { DashboardService } from './dashboard.service';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, BottomNavComponent, LoadingComponent],
  templateUrl: './dashboard.component.html'
})
export default class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AuthService);

  cursos = signal<Curso[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  erro = signal<string | null>(null);

  get primeiroNome(): string {
    const nome = this.authService.usuarioAtual()?.nomeCompleto ?? '';
    return nome.split(' ')[0] || 'Aluno';
  }

  get cursoDestaque(): Curso | null {
    return this.cursos()[0] ?? null;
  }

  ngOnInit(): void {
    this.dashboardService.carregarDados().subscribe({
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
}
