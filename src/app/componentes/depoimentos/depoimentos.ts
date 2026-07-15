import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Depoimento {
  nome: string;
  texto: string;
}

@Component({
  selector: 'app-depoimentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './depoimentos.html',
  styleUrl: './depoimentos.css'
})
export class Depoimentos implements OnInit, OnDestroy {
  
  depoimentos: Depoimento[] = [
    {
      nome: 'Lucas Silva',
      texto: 'Melhor corte que já fiz na vida! O atendimento do início ao fim é impecável. A cerveja gelada e a conversa de alto nível fazem a diferença.'
    },
    {
      nome: 'Bruno Souza',
      texto: 'O ambiente é sensacional. O cuidado com a higiene e a precisão da navalha na barba me tornaram cliente fiel. Recomendo muito o trabalho do Maique!'
    },
    {
      nome: 'Rafael Oliveira',
      texto: 'Espaço extremamente premium. Mais que um simples corte de cabelo, é uma experiência de relaxamento excelente. Profissionais extremamente atenciosos.'
    },
    {
      nome: 'Mateus Santos',
      texto: 'Minha barba nunca ficou tão bem alinhada. O design feito com toalha quente é outro nível de conforto. Vale cada centavo.'
    }
  ];

  slideAtivo = 0;
  private autoPlayInterval: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.iniciarAutoPlay();
  }

  ngOnDestroy() {
    this.pararAutoPlay();
  }

  proximo() {
    this.slideAtivo = (this.slideAtivo + 1) % this.depoimentos.length;
  }

  anterior() {
    this.slideAtivo = this.slideAtivo === 0 ? this.depoimentos.length - 1 : this.slideAtivo - 1;
  }

  irParaSlide(index: number) {
    this.slideAtivo = index;
    this.reiniciarAutoPlay();
  }

  // Avança manualmente quando clicado nas setas (reinicia o tempo para dar tempo ao usuário ler)
  cliqueProximo() {
    this.proximo();
    this.reiniciarAutoPlay();
  }

  cliqueAnterior() {
    this.anterior();
    this.reiniciarAutoPlay();
  }

  private iniciarAutoPlay() {
    if (isPlatformBrowser(this.platformId)) {
      this.pararAutoPlay(); // Garante que não há outro intervalo rodando em paralelo
      this.autoPlayInterval = setInterval(() => {
        this.proximo();
      }, 5000); // 5 segundos
    }
  }

  private pararAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private reiniciarAutoPlay() {
    this.pararAutoPlay();
    this.iniciarAutoPlay();
  }
}