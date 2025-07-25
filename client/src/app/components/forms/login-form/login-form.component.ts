import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextInputComponent } from '../../inputs/text-input/text-input.component';

export interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Output() loginSuccess = new EventEmitter<LoginData>();
  @Output() forgotPassword = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginData = this.loginForm.value;
      this.loginSuccess.emit(loginData);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotPassword(): void {
    this.forgotPassword.emit();
  }

  reset(): void {
    this.loginForm.reset();
  }

  // Getters pour accéder aux contrôles
  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }
}
