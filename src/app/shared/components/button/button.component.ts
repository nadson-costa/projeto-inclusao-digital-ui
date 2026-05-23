import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button
      [type]="nativeType"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
    >
      @if (loading) {
        <span class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      }
      {{ label }}
    </button>
  `
})
export class ButtonComponent {
  @Input() label = '';
  @Input() type: 'primary' | 'ghost' | 'danger' = 'primary';
  @Input() nativeType: 'button' | 'submit' | 'reset' = 'button';
  @Input() loading = false;
  @Input() disabled = false;

  get buttonClasses(): string {
    const base = 'flex items-center justify-center w-full h-14 rounded-btn font-semibold text-base transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary: 'bg-gradient-to-r from-orange-primary to-orange-dark text-white shadow-md',
      ghost: 'bg-transparent border-2 border-orange-primary text-orange-primary',
      danger: 'bg-red-600 text-white'
    };

    return `${base} ${variants[this.type]}`;
  }
}
