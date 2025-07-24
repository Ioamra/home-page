import { Component, Input, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() id = '';
  @Input() name = '';

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };
  private readonly ngControl = inject(NgControl, { optional: true });

  constructor() {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }

  get isInvalid(): boolean {
    return !!(this.ngControl?.control?.invalid && this.ngControl?.control?.touched);
  }

  get errorMessage(): string {
    const errors = this.ngControl?.control?.errors;
    if (!errors) return '';

    const [key, value] = Object.entries(errors)[0];
    const messages: Record<string, string> = {
      required: `${this.label} est requis`,
      email: "Format d'email invalide",
      minlength: `${this.label} doit contenir au moins ${value.requiredLength} caractères`,
      maxlength: `${this.label} ne peut pas dépasser ${value.requiredLength} caractères`,
    };
    return messages[key] || 'Champ invalide';
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
