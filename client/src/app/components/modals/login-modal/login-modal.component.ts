import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../../stores/auth.store';
import { TextInputComponent } from '../../inputs/text-input/text-input.component';
import { BaseModalComponent } from '../base-modal/base-modal.component';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [BaseModalComponent, CommonModule, FormsModule, TextInputComponent],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  private readonly authStore = inject(AuthStore);

  loginData = {
    email: '',
    password: '',
  };

  onClose(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    if (this.loginData.email && this.loginData.password) {
      // Ici vous pouvez appeler votre service d'authentification
      console.log('Login attempt:', this.loginData);
      // this.authStore.login(this.loginData);
      this.onClose();
    }
  }
}
