import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Usuario {
  nome: string;
  email: string;
  telefone?: string;
  senha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioLogado = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private obtenerTodosUsuarios(): Usuario[] {
    if (!this.isBrowser) return [];
    const usuarios = localStorage.getItem('maique_barber_usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  isLogado(): boolean {
    if (!this.isBrowser) return false;
    return localStorage.getItem('maique_barber_sessao') !== null;
  }

  getUsuarioLogado(): Usuario | null {
    if (!this.isBrowser) return null;
    const sessao = localStorage.getItem('maique_barber_sessao');
    return sessao ? JSON.parse(sessao) : null;
  }

  fazerLogin(email: string, senhaInput: string): boolean {
    if (!this.isBrowser) return false;

    if (email.trim().toLowerCase() === 'maique@barber.com' && senhaInput === '123456') {
      const dadosSessao: Usuario = {
        nome: 'Maique Barber',
        email: 'maique@barber.com',
        telefone: '(11) 99999-9999'
      };
      localStorage.setItem('maique_barber_sessao', JSON.stringify(dadosSessao));
      return true;
    }

    const usuarios = this.obtenerTodosUsuarios();
    const usuarioEncontrado = usuarios.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senhaInput
    );

    if (usuarioEncontrado) {
      const dadosSessao: Usuario = {
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        telefone: usuarioEncontrado.telefone
      };
      localStorage.setItem('maique_barber_sessao', JSON.stringify(dadosSessao));
      return true;
    }

    return false;
  }

  cadastrar(novoUsuario: Usuario): { sucesso: boolean; mensagem: string } {
    if (!this.isBrowser) return { sucesso: false, mensagem: 'Erro no servidor.' };

    if (novoUsuario.email.trim().toLowerCase() === 'maique@barber.com') {
      return { sucesso: false, mensagem: 'Este e-mail é do proprietário! Não precisa cadastrar, basta fazer o login direto.' };
    }

    const usuarios = this.obtenerTodosUsuarios();
    
    const emailExistente = usuarios.some(
      u => u.email.toLowerCase() === novoUsuario.email.trim().toLowerCase()
    );

    if (emailExistente) {
      return { sucesso: false, mensagem: 'Este e-mail já está cadastrado!' };
    }

    usuarios.push(novoUsuario);
    localStorage.setItem('maique_barber_usuarios', JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
  }

  fazerLogout() {
    if (this.isBrowser) {
      localStorage.removeItem('maique_barber_sessao');
    }
  }

  logout() {
    this.fazerLogout();
  }
}