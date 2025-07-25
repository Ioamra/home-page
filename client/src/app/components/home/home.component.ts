import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { HomeStore } from '../../stores/home.store';
import { AuthModalComponent } from '../modals/auth-modal/auth-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AuthModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly homeStore = inject(HomeStore);
  protected readonly authStore = inject(AuthStore);

  isAuthModalOpen = false;
  authModalTab: 'login' | 'register' = 'login';

  openLoginModal(): void {
    this.authModalTab = 'login';
    this.isAuthModalOpen = true;
  }

  openRegisterModal(): void {
    this.authModalTab = 'register';
    this.isAuthModalOpen = true;
  }

  closeAuthModal(): void {
    this.isAuthModalOpen = false;
  }
}
