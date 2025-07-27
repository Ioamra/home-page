import { Component, inject, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {
  protected readonly homeStore = inject(HomeStore);
  protected readonly authStore = inject(AuthStore);

  isAuthModalOpen = false;
  authModalTab: 'login' | 'register' = 'login';

  ngOnInit(): void {
    this.homeStore.getMyConfig();
  }

  openProfileModal(): void {
    console.log('Open profile modal');
  }

  openAuthModal(tab: 'login' | 'register'): void {
    this.authModalTab = tab;
    this.isAuthModalOpen = true;
  }

  closeAuthModal(): void {
    this.isAuthModalOpen = false;
    this.homeStore.getMyConfig();
  }
}
