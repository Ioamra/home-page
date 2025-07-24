import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthStore } from '../../../stores/auth.store';
import { TextInputComponent } from '../../inputs/text-input/text-input.component';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [BaseModalComponent, CommonModule, ReactiveFormsModule, TextInputComponent],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  private readonly authStore = inject(AuthStore);
  private readonly fb = inject(FormBuilder);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onClose(): void {
    this.loginForm.reset();
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Ici vous pouvez appeler votre service d'authentification
      // const loginData = this.loginForm.value;
      // this.authStore.login(loginData);
      this.onClose();
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.loginForm.markAllAsTouched();
    }
  }

  // Méthodes utilitaires pour accéder facilement aux contrôles
  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }
}
