import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService } from './core/services/auth/auth.service';
import { User } from './domain/entities/user.entity';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, AsyncPipe ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  protected readonly title : WritableSignal<string> = signal('Level Me Up');
  private authService: AuthService = inject(AuthService);
  protected currentUser$ : Observable<User | null> = this.authService.currentUser$;

  async handleLogin() : Promise<void> {
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Falha ao fazer login com Google.');
    }
  }

  async handleLogout() : Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
      alert('Falha ao fazer logout.');
    }
  }

}
