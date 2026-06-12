import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Variáveis para controlar o scroll do Header
  private ultimoScroll = 0;
  isHeaderEscondido = false;

  // Variável para controlar o menu hamburguer no mobile
  isMenuAberto = false;

  // 1. LÓGICA DO SCROLL (Substitui o window.addEventListener('scroll'))
  @HostListener('window:scroll', [])
  onWindowScroll() {

    this.fecharMenu();

    const scrollAtual = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollAtual <= 0) {
      this.isHeaderEscondido = false;
      return;
    }

    if (scrollAtual > this.ultimoScroll && !this.isHeaderEscondido) {
      this.isHeaderEscondido = true; // Esconde o menu rolando para baixo
    } else if (scrollAtual < this.ultimoScroll && this.isHeaderEscondido) {
      this.isHeaderEscondido = false; // Mostra o menu rolando para cima
    }
    
    this.ultimoScroll = scrollAtual;
  }

  // 2. LÓGICA DO MENU MOBILE (Substitui os cliques de abrir/fechar)
  toggleMenu() {
    this.isMenuAberto = !this.isMenuAberto;
  }

  fecharMenu() {
    this.isMenuAberto = false;
  }
}