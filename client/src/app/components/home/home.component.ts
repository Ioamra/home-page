import { Component, inject } from '@angular/core';
import { AuthStore } from '../../stores/auth.store';
import { HomeStore } from '../../stores/home.store';
import { LoginModalComponent } from '../modals/login-modal/login-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  protected readonly homeStore = inject(HomeStore);
  protected readonly authStore = inject(AuthStore);

  isLoginModalOpen = false;

  openLoginModal() {
    this.isLoginModalOpen = true;
  }

  closeLoginModal() {
    this.isLoginModalOpen = false;
  }
}
