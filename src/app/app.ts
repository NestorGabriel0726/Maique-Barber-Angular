import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

// Importação de componentes criados
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
export class App {
  
  constructor(private router: Router) {}

  // se eu estiver no login ou no agendamento, some com o resto da landing page
  isRotaAuxiliar(): boolean {
    return this.router.url.includes('/login') || this.router.url.includes('/agendamento') || this.router.url.includes('/dashboard');
  }
}