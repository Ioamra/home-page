import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { AuthStore } from '../../../stores/auth.store';
import { HomeStore } from '../../../stores/home.store';
import { LoginData, LoginFormComponent } from '../../forms/login-form/login-form.component';
import {
  RegisterData,
  RegisterFormComponent,
} from '../../forms/register-form/register-form.component';

type AuthTab = 'login' | 'register';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {
  @Input() isOpen = false;
  @Input() initialTab: AuthTab = 'login';
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(LoginFormComponent) loginForm?: LoginFormComponent;
  @ViewChild(RegisterFormComponent) registerForm?: RegisterFormComponent;

  private readonly authStore = inject(AuthStore);
  private readonly homeStore = inject(HomeStore);

  activeTab: AuthTab = 'login';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.activeTab = this.initialTab;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  setActiveTab(tab: AuthTab): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  onClose(): void {
    this.clearMessages();
    this.closeModal.emit();
  }

  onLoginSuccess(loginData: LoginData): void {
    this.isLoading = true;
    this.clearMessages();
    this.authStore
      .login({
        email: loginData.email,
        password: loginData.password,
      })
      .subscribe({
        next: () => {
          this.homeStore.getMyConfig();
          this.closeModal.emit();
        },
        error: error => {
          this.errorMessage = 'Erreur lors de la connexion. Vérifiez vos identifiants.';
          console.error('Erreur de connexion:', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  async onRegisterSuccess(registerData: RegisterData): Promise<void> {
    try {
      this.isLoading = true;
      this.clearMessages();

      await this.authStore
        .register({
          email: registerData.email,
          password: registerData.password,
          photo: registerData.photo,
        })
        .subscribe({
          next: () => {
            this.homeStore.getMyConfig();
            this.closeModal.emit();
          },
          error: error => {
            this.errorMessage = "Erreur lors de l'inscription. Vérifiez vos identifiants.";
            console.error('Erreur de connexion:', error);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } catch (error) {
      this.errorMessage = "Erreur lors de l'inscription. L'email est peut-être déjà utilisé.";
      console.error("Erreur d'inscription:", error);
    } finally {
      this.isLoading = false;
    }
  }

  onForgotPassword(): void {
    // Ici vous pouvez implémenter la logique pour mot de passe oublié
    // Par exemple, ouvrir un autre modal ou rediriger vers une page
    console.warn('Mot de passe oublié - À implémenter');
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
