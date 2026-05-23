import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CadastroRequest } from '../../../core/models/auth.model';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string;
  if (!v) return null;
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) ? null : { cpfInvalido: true };
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent],
  templateUrl: './cadastro.component.html'
})
export default class CadastroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);
  erro = signal<string | null>(null);

  form = this.fb.group({
    nomeCompleto: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required, cpfValidator]],
    dataNascimento: ['', Validators.required],
    telefone: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    emergenciaNome: ['', Validators.required],
    emergenciaTelefone: ['', Validators.required],
    emergenciaParentesco: ['', Validators.required],
  });

  fieldError(field: string): string | null {
    const c = this.form.get(field);
    if (!c?.touched) return null;
    if (c.hasError('required')) return 'Campo obrigatório';
    if (c.hasError('email')) return 'E-mail inválido';
    if (c.hasError('cpfInvalido')) return 'Use o formato 000.000.000-00';
    if (c.hasError('minlength')) return 'Mínimo 6 caracteres';
    return null;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    this.authService.cadastro(this.form.getRawValue() as CadastroRequest).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e: Error) => {
        this.erro.set(e.message);
        this.loading.set(false);
      }
    });
  }
}
