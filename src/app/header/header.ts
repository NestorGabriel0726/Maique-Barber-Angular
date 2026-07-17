import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isMenuAberto = false;
  isHeaderEscondido = false;
  isLightMode = false;
  private ultimoScroll = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.detectarTemaInicial();
  }

  detectarTemaInicial() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLightMode = document.body.classList.contains('light-mode');
    }
  }

  toggleMenu() {
    this.isMenuAberto = !this.isMenuAberto;
  }

  fecharMenu() {
    this.isMenuAberto = false;
  }

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('light-mode', this.isLightMode);
    }
  }

  estaLogado(): boolean {
    return this.authService.isLogado();
  }

  // Executa o Logout e navega para a Home
  logout() {
    this.fecharMenu();
    
    
    if (typeof this.authService.logout === 'function') {
      this.authService.logout();
    } else if (typeof this.authService.logout === 'function') {
      this.authService.logout();
    } else {
      (this.authService as any).isLoggedIn = false; 
    }

    // Redireciona para a página de login novamente
    this.router.navigate(['/login']);
  }

  aoClicarBotao() {
    if (this.estaLogado()) {
      const elemento = document.getElementById('contato');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Efeito de esconder o Header ao rolar para baixo e mostrar ao rolar para cima
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollAtual = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollAtual > this.ultimoScroll && scrollAtual > 150) {
        this.isHeaderEscondido = true;
      } else {
        this.isHeaderEscondido = false;
      }
      this.ultimoScroll = scrollAtual <= 0 ? 0 : scrollAtual;
    }
  }
}