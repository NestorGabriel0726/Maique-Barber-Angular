import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// Os imports das seções
import { Header } from "./header/header";
import { Home } from "./componentes/home/home";
import { Servicos } from './componentes/servicos/servicos';
import { Sobre } from './componentes/sobre/sobre';
import { Galeria } from './componentes/galeria/galeria';
import { Depoimentos } from './componentes/depoimentos/depoimentos';
import { Contato } from './componentes/contato/contato';
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule, // Adicionado para garantir o funcionamento do @if
    RouterOutlet, 
    Header, 
    Footer, 
    Home, 
    Servicos, 
    Sobre, 
    Galeria, 
    Depoimentos, 
    Contato
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isNaAgenda: boolean = false;
  isNoDashboard: boolean = false;

  constructor(private router: Router) {
    // Escuta as mudanças de rota 
    this.router.events.subscribe((event) => {
  if (event instanceof NavigationEnd) {
    // Se a URL contiver qualquer uma das rotas internas, ativa a trava para esconder a Home
    this.isNaAgenda = event.url.includes('agendamento') || 
                      event.url.includes('login') || 
                      event.url.includes('dashboard');
    
    this.isNoDashboard = event.url.includes('dashboard');
    
    if (typeof window !== 'undefined') {

      window.scrollTo(0, 0);

    }
  }
  });
  }
}