import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';


import { Header } from './header/header'; 
import { Home } from './componentes/home/home';
import { Servicos } from './componentes/servicos/servicos';
import { Sobre } from './componentes/sobre/sobre';
import { Galeria } from './componentes/galeria/galeria';
import { Depoimentos } from './componentes/depoimentos/depoimentos';
import { Contato } from './componentes/contato/contato';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    Header,
    Home,
    Servicos,
    Sobre,
    Galeria,
    Depoimentos,
    Contato,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App { // ou export class AppComponent
  
  constructor(private router: Router) {}

  // Retorna true se o usuário estiver na tela de login
  isTelaLogin(): boolean {
    return this.router.url === '/login';
  }
}