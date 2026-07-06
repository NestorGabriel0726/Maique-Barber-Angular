import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
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
    CommonModule,
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
  
}