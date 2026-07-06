import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Controle de scroll do Header
  private ultimoScroll = 0;
  isHeaderEscondido = false;

  // Controle do menu mobile
  isMenuAberto = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.fecharMenu();
    const scrollAtual = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollAtual <= 0) {
      this.isHeaderEscondido = false;
      return;
    }

    if (scrollAtual > this.ultimoScroll && !this.isHeaderEscondido) {
      this.isHeaderEscondido = true;
    } else if (scrollAtual < this.ultimoScroll && this.isHeaderEscondido) {
      this.isHeaderEscondido = false;
    }
    
    this.ultimoScroll = scrollAtual;
  }

  toggleMenu() {
    this.isMenuAberto = !this.isMenuAberto;
  }

  fecharMenu() {
    this.isMenuAberto = false;
  }
}