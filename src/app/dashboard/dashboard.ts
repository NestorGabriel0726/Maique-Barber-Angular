import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

interface Agendamento {
  id: number;
  clienteNome: string;
  clienteTelefone: string; 
  observacao?: string;
  servicoNome: string;
  preco: number;
  data: string; 
  horario: string;
  status: 'Pendente' | 'Concluído' | 'Cancelado';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  isLightMode = false;
  barbeiroNome = 'Maique';

  // Filtro de data (Inicia com o dia de hoje)
  dataFiltro: string = new Date().toISOString().split('T')[0];

  todosAgendamentos: Agendamento[] = [];
  agendamentosFiltrados: Agendamento[] = [];

  // Métricas do Painel
  faturamentoTotal = 0;
  cortesPendentes = 0;
  cortesConcluidos = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.verificarTemaAtual();
    this.carregarTodosAgendamentos();
  }

  verificarTemaAtual() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLightMode = document.body.classList.contains('light-mode');
    }
  }

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('light-mode', this.isLightMode);
    }
    this.cdr.detectChanges();
  }

  carregarTodosAgendamentos() {
    if (isPlatformBrowser(this.platformId)) {
      const dados = localStorage.getItem('maique_barber_historico');
      if (dados) {
        this.todosAgendamentos = JSON.parse(dados);
      }
      this.filtrarECalcularMetricas();
    }
  }

  filtrarECalcularMetricas() {
    // 1. Filtra os agendamentos pela data selecionada no input
    this.agendamentosFiltrados = this.todosAgendamentos.filter(
      ag => ag.data === this.dataFiltro
    ).sort((a, b) => a.horario.localeCompare(b.horario)); // Ordena por hora (09:00, 10:00...)

    // 2. Zera as métricas para recalcular
    this.faturamentoTotal = 0;
    this.cortesPendentes = 0;
    this.cortesConcluidos = 0;

    // 3. Calcula os cartões com base na lista do dia filtrado
    this.agendamentosFiltrados.forEach(ag => {
      if (ag.status === 'Concluído') {
        this.faturamentoTotal += ag.preco;
        this.cortesConcluidos++;
      } else if (ag.status === 'Pendente') {
        this.cortesPendentes++;
      }
    });
  }

  atualizarStatus(id: number, novoStatus: 'Concluído' | 'Cancelado') {
    // Atualiza na lista principal
    this.todosAgendamentos = this.todosAgendamentos.map(ag => {
      if (ag.id === id) {
        ag.status = novoStatus;
        
        // Se foi cancelado, precisamos liberar o horário no sistema de vagas
        if (novoStatus === 'Cancelado') {
          this.liberarHorarioOcupado(ag.data, ag.horario);
        }
      }
      return ag;
    });

    // Salva de volta no LocalStorage e atualiza a tela
    localStorage.setItem('maique_barber_historico', JSON.stringify(this.todosAgendamentos));
    this.filtrarECalcularMetricas();
  }

  private liberarHorarioOcupado(dataStr: string, horario: string) {
    const dadosOcupados = localStorage.getItem('maique_barber_horarios_ocupados');
    if (dadosOcupados) {
      let mapaHorarios = JSON.parse(dadosOcupados);
      if (mapaHorarios[dataStr]) {
        mapaHorarios[dataStr] = mapaHorarios[dataStr].filter((h: string) => h !== horario);
        localStorage.setItem('maique_barber_horarios_ocupados', JSON.stringify(mapaHorarios));
      }
    }
  }

  logout() {
    this.authService.logout(); // Limpa a sessão
    this.router.navigate(['/login']);
  }
}