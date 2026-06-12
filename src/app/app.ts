import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'; // Certifique-se de ter esses 3
import { CommonModule } from '@angular/common'; // Adicione o CommonModule por garantia

// Seus imports das seções
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
  standalone: true, // Garanta que está como standalone
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

  constructor(private router: Router) {
    // Escuta as mudanças de rota de forma segura
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Se a rota ativa for /agendamento, ativa a trava
        this.isNaAgenda = event.url.includes('agendamento');

        window.scrollTo(0, 0);
      }
    });
  }
}