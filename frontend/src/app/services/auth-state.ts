import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _username = signal<string | null>(localStorage.getItem('username'));

  readonly token = computed(() => this._token());
  readonly username = computed(() => this._username());
  readonly isLoggedIn = computed(() => this._token() !== null);

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
