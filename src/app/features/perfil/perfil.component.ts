import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PerfilService, UsuarioEditRequest } from './perfil.service';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, BottomNavComponent, InputComponent, ButtonComponent],
  templateUrl: './perfil.component.html'
})
export default class PerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly perfilService = inject(PerfilService);
  private readonly router = inject(Router);

  readonly usuario = this.authService.usuarioAtual;

  modoEdicao = signal(false);
  loading = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal(false);

  form = this.fb.group({
    nomeCompleto: ['', Validators.required],
    telefone: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    emergenciaNome: ['', Validators.required],
    emergenciaTelefone: ['', Validators.required],
    emergenciaParentesco: ['', Validators.required],
  });

  ngOnInit(): void {
    const u = this.usuario();
    if (u) {
      this.form.patchValue({
        nomeCompleto: u.nomeCompleto,
        telefone: u.telefone,
        dataNascimento: u.dataNascimento,
        emergenciaNome: u.emergenciaNome,
        emergenciaTelefone: u.emergenciaTelefone,
        emergenciaParentesco: u.emergenciaParentesco,
      });
    }
  }

  entrarEdicao(): void {
    this.modoEdicao.set(true);
    this.erro.set(null);
    this.sucesso.set(false);
  }

  cancelar(): void {
    const u = this.usuario();
    if (u) {
      this.form.patchValue({
        nomeCompleto: u.nomeCompleto,
        telefone: u.telefone,
        dataNascimento: u.dataNascimento,
        emergenciaNome: u.emergenciaNome,
        emergenciaTelefone: u.emergenciaTelefone,
        emergenciaParentesco: u.emergenciaParentesco,
      });
    }
    this.modoEdicao.set(false);
    this.erro.set(null);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    this.perfilService.editar(this.form.getRawValue() as UsuarioEditRequest).subscribe({
      next: (usuario) => {
        this.authService.usuarioAtual.set(usuario);
        this.modoEdicao.set(false);
        this.sucesso.set(true);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.loading.set(false);
      }
    });
  }

  fieldError(field: string): string | null {
    const c = this.form.get(field);
    if (!c?.touched) return null;
    if (c.hasError('required')) return 'Campo obrigatório';
    return null;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }

  get iniciais(): string {
    const nome = this.usuario()?.nomeCompleto ?? '';
    return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
}
