import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './login.component.html'
})
export default class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  erro = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  get emailError(): string | null {
    const c = this.form.get('email');
    if (!c?.touched) return null;
    if (c.hasError('required')) return 'E-mail obrigatório';
    if (c.hasError('email')) return 'E-mail inválido';
    return null;
  }

  get senhaError(): string | null {
    const c = this.form.get('senha');
    if (!c?.touched) return null;
    if (c.hasError('required')) return 'Senha obrigatória';
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    const { email, senha } = this.form.value;

    this.authService.login(email!, senha!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.loading.set(false);
      }
    });
  }
}
