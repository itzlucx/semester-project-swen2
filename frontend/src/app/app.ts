import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthStateService } from './services/auth-state';
import { AuthService } from './services/auth';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  protected authState = inject(AuthStateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  protected showNavbar = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => {
        const url = this.router.url;
        return !url.includes('/login') && !url.includes('/register');
      }),
    ),
    { initialValue: false },
  );

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
