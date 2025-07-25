import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { AuthStore } from '../../../stores/auth.store';
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
export class AuthModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() initialTab: AuthTab = 'login';
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('dialog', { static: false }) dialog!: ElementRef<HTMLDialogElement>;

  private readonly authStore = inject(AuthStore);

  activeTab: AuthTab = 'login';

  constructor() {
    this.activeTab = this.initialTab;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.dialog) {
      if (this.isOpen) {
        this.dialog.nativeElement.showModal();
      } else {
        this.dialog.nativeElement.close();
      }
    }

    if (changes['initialTab']) {
      this.activeTab = this.initialTab;
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog.nativeElement) {
      this.onClose();
    }
  }

  setActiveTab(tab: AuthTab): void {
    this.activeTab = tab;
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onLoginSuccess(_loginData: LoginData): void {
    // Ici vous pouvez appeler votre service d'authentification
    // this.authStore.login(loginData);
    this.closeModal.emit();
  }

  onRegisterSuccess(_registerData: RegisterData): void {
    // Ici vous pouvez appeler votre service d'authentification
    // this.authStore.register(registerData);
    this.closeModal.emit();
  }

  onForgotPassword(): void {
    // Ici vous pouvez implémenter la logique pour mot de passe oublié
  }
}
