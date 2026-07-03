import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _username = signal<string | null>(localStorage.getItem('username'));

  readonly token = computed(() => this._token());
  readonly username = computed(() => this._username());
  readonly isLoggedIn = computed(() => this._token() !== null);

  constructor() {
    // Führt aus wenn localStorage sich in anderem Tab ändert
    window.addEventListener('storage', () => {
      this._token.set(localStorage.getItem('token'));
      this._username.set(localStorage.getItem('username'));
    });

    //Reagiert auf Signal-Änderung in diesem Tab
    effect(() => {
      // Wenn Token plötzlich weg ist (zB durch Ausloggen in einem anderen Tab)
      if (!this._token()) {
        this.router.navigate(['/login']);
      }
    });
  }

  setAuth(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    this._token.set(token);
    this._username.set(username);
  }

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this._token.set(null);
    this._username.set(null);
  }
}