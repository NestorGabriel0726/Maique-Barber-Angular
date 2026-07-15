import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioLogado = false;

  isLogado(): boolean {
    return this.usuarioLogado;
  }

  fazerLogin() {
    this.usuarioLogado = true;
  }

  fazerLogout() {
    this.usuarioLogado = false;
  }
}