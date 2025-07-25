import { Component, Input, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-text-input',
  imports: [FaIconComponent],
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
  showPassword = false;

  // FontAwesome icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

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

  get isPasswordType(): boolean {
    return this.type === 'password';
  }

  get inputType(): string {
    return this.isPasswordType && this.showPassword ? 'text' : this.type;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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
