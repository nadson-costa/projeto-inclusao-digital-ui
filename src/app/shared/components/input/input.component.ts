import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex flex-col gap-1">
      <label [for]="inputId" class="text-sm font-semibold text-text-light">
        {{ label }}
      </label>
      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="isDisabled"
        [attr.aria-describedby]="error ? inputId + '-error' : null"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="h-14 px-4 rounded-input border-2 text-base outline-none transition-colors duration-200
               bg-white text-text-light placeholder:text-text-muted
               border-border-base focus:border-orange-primary
               disabled:bg-gray-50 disabled:cursor-not-allowed"
        [class.border-red-500]="!!error"
      />
      @if (error) {
        <span [id]="inputId + '-error'" class="text-sm text-red-600 mt-0.5">{{ error }}</span>
      }
    </div>
  `
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() error: string | null = null;

  readonly inputId = `input-${Math.random().toString(36).slice(2, 9)}`;

  value = '';
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }
}
