import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageInputComponent } from '../../inputs/image-input/image-input.component';
import { TextInputComponent } from '../../inputs/text-input/text-input.component';

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  photo: File | null;
}

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent, ImageInputComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnChanges {
  @Input() disabled = false;
  @Output() registerSuccess = new EventEmitter<RegisterData>();

  private readonly fb = inject(FormBuilder);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        photo: [null], // Pas obligatoire
      },
      { validators: this.passwordMatchValidator },
    );
  }

  ngOnChanges(): void {
    if (this.disabled) {
      this.registerForm.disable();
    } else {
      this.registerForm.enable();
    }
  }

  passwordMatchValidator(form: AbstractControl): Record<string, boolean> | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.disabled) {
      const registerData: RegisterData = this.registerForm.value;
      this.registerSuccess.emit(registerData);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  reset(): void {
    this.registerForm.reset();
  }

  // Getters pour accéder aux contrôles
  get email(): AbstractControl | null {
    return this.registerForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.registerForm.get('confirmPassword');
  }

  get photo(): AbstractControl | null {
    return this.registerForm.get('photo');
  }
}
