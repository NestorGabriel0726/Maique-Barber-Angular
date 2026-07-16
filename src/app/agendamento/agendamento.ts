import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth.service';

interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracao: string;
}

interface Agendamento {
  id: number;
  clienteNome: string;
  servicoNome: string;
  preco: number;
  data: string; 
  horario: string;
  status: 'Pendente' | 'Concluído' | 'Cancelado';
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css'
})
export class AgendamentoComponent implements OnInit {
  isLightMode = false;
  mostrarModalConfirmacao = false;

  // Sincronizei os servicos com a landing page pra bater certinho os valores e nomes!
  servicos: Servico[] = [
    { id: 1, nome: 'Corte Classic', preco: 25.00, duracao: '30 min' },
    { id: 2, nome: 'Corte Navalhado', preco: 30.00, duracao: '40 min' },
    { id: 3, nome: 'Corte na Tesoura', preco: 30.00, duracao: '45 min' },
    { id: 4, nome: 'Combo Maique Barber', preco: 35.00, duracao: '60 min' },
    { id: 5, nome: 'Luzes / Reflexo', preco: 50.00, duracao: '90 min' },
    { id: 6, nome: 'Platinado', preco: 70.00, duracao: '120 min' }
  ];

  clienteNome = 'Gabriel Santos'; 
  servicoSelecionado: Servico | null = null;
  dataSelecionada: string = ''; 
  horarioSelecionado: string = '';

  meses: string[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  dataAtual = new Date();
  anoExibido: number = this.dataAtual.getFullYear();
  mesExibido: number = this.dataAtual.getMonth();
  diasDoMes: { dia: number; dataString: string; isOutroMes: boolean; isPassado: boolean }[] = [];

  horariosPredefinidos: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  horariosIndisponiveis: { [data: string]: string[] } = {}; 

  historicoAgendamentos: Agendamento[] = [];
  ultimoAgendamentoCriado: Agendamento | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.verificarTemaAtual();
    this.carregarHorariosOcupados();
    this.carregarHistorico();
    this.gerarCalendario();
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

  carregarHorariosOcupados() {
    if (isPlatformBrowser(this.platformId)) {
      const dados = localStorage.getItem('maique_barber_horarios_ocupados');
      if (dados) {
        this.horariosIndisponiveis = JSON.parse(dados);
      } else {
        const hoje = new Date().toISOString().split('T')[0];
        this.horariosIndisponiveis = {
          [hoje]: ['10:00', '15:00', '17:00']
        };
        localStorage.setItem('maique_barber_horarios_ocupados', JSON.stringify(this.horariosIndisponiveis));
      }
    }
  }

  carregarHistorico() {
    if (isPlatformBrowser(this.platformId)) {
      const historicoSalvo = localStorage.getItem('maique_barber_historico');
      if (historicoSalvo) {
        this.historicoAgendamentos = JSON.parse(historicoSalvo);
      } else {
        // usei o Combo Maique Barber no historico de teste pra combinar com a lista nova
        this.historicoAgendamentos = [
          { id: 101, clienteNome: this.clienteNome, servicoNome: 'Combo Maique Barber', preco: 35.00, data: '2026-07-10', horario: '14:00', status: 'Concluído' },
          { id: 102, clienteNome: this.clienteNome, servicoNome: 'Corte Classic', preco: 25.00, data: '2026-07-10', horario: '14:30', status: 'Concluído' }
        ];
        localStorage.setItem('maique_barber_historico', JSON.stringify(this.historicoAgendamentos));
      }
    }
  }

  gerarCalendario() {
    this.diasDoMes = [];
    const primeiroDiaMes = new Date(this.anoExibido, this.mesExibido, 1).getDay();
    const ultimoDiaMes = new Date(this.anoExibido, this.mesExibido + 1, 0).getDate();
    const ultimoDiaMesAnterior = new Date(this.anoExibido, this.mesExibido, 0).getDate();

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    for (let i = primeiroDiaMes - 1; i >= 0; i--) {
      const diaNum = ultimoDiaMesAnterior - i;
      const dataStr = `${this.anoExibido}-${String(this.mesExibido).padStart(2, '0')}-${String(diaNum).padStart(2, '0')}`;
      this.diasDoMes.push({ dia: diaNum, dataString: dataStr, isOutroMes: true, isPassado: true });
    }

    for (let i = 1; i <= ultimoDiaMes; i++) {
      const dataComparar = new Date(this.anoExibido, this.mesExibido, i);
      const dataStr = `${this.anoExibido}-${String(this.mesExibido + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isPassado = dataComparar < hoje;
      this.diasDoMes.push({ dia: i, dataString: dataStr, isOutroMes: false, isPassado });
    }
  }

  mudarMes(direcao: number) {
    this.mesExibido += direcao;
    if (this.mesExibido < 0) {
      this.mesExibido = 11;
      this.anoExibido--;
    } else if (this.mesExibido > 11) {
      this.mesExibido = 0;
      this.anoExibido++;
    }
    this.gerarCalendario();
  }

  selecionarData(dataStr: string, isPassado: boolean) {
    if (isPassado) return;
    this.dataSelecionada = dataStr;
    this.horarioSelecionado = ''; 
  }

  isHorarioOcupado(horario: string): boolean {
    if (!this.dataSelecionada) return false;
    return this.horariosIndisponiveis[this.dataSelecionada]?.includes(horario) || false;
  }

  selecionarHorario(horario: string) {
    if (this.isHorarioOcupado(horario)) return;
    this.horarioSelecionado = horario;
  }

  aoSelecionarServicoId(event: any) {
    const id = Number(event.target.value);
    this.servicoSelecionado = this.servicos.find(s => s.id === id) || null;
  }

  salvarAgendamento() {
    if (!this.servicoSelecionado || !this.dataSelecionada || !this.horarioSelecionado) {
      alert('Preencha todos os campos do agendamento.');
      return;
    }

    const novoAgendamento: Agendamento = {
      id: Date.now(),
      clienteNome: this.clienteNome,
      servicoNome: this.servicoSelecionado.nome,
      preco: this.servicoSelecionado.preco,
      data: this.dataSelecionada,
      horario: this.horarioSelecionado,
      status: 'Pendente'
    };

    this.historicoAgendamentos.unshift(novoAgendamento);
    localStorage.setItem('maique_barber_historico', JSON.stringify(this.historicoAgendamentos));

    if (!this.horariosIndisponiveis[this.dataSelecionada]) {
      this.horariosIndisponiveis[this.dataSelecionada] = [];
    }
    this.horariosIndisponiveis[this.dataSelecionada].push(this.horarioSelecionado);
    localStorage.setItem('maique_barber_horarios_ocupados', JSON.stringify(this.horariosIndisponiveis));

    this.ultimoAgendamentoCriado = novoAgendamento;
    this.mostrarModalConfirmacao = true;

    this.servicoSelecionado = null;
    this.dataSelecionada = '';
    this.horarioSelecionado = '';
  }

  cancelarAgendamento(id: number) {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      this.historicoAgendamentos = this.historicoAgendamentos.map(ag => {
        if (ag.id === id) {
          ag.status = 'Cancelado';
          if (this.horariosIndisponiveis[ag.data]) {
            this.horariosIndisponiveis[ag.data] = this.horariosIndisponiveis[ag.data].filter(h => h !== ag.horario);
            localStorage.setItem('maique_barber_horarios_ocupados', JSON.stringify(this.horariosIndisponiveis));
          }
        }
        return ag;
      });
      localStorage.setItem('maique_barber_historico', JSON.stringify(this.historicoAgendamentos));
    }
  }

  repetirServicoAnterior(agendamento: Agendamento) {
    const servicoCorrespondente = this.servicos.find(s => s.nome === agendamento.servicoNome);
    if (servicoCorrespondente) {
      this.servicoSelecionado = servicoCorrespondente;
      this.dataSelecionada = ''; 
      this.horarioSelecionado = '';
      
      document.getElementById('form-agendamento')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  fecharModal() {
    this.mostrarModalConfirmacao = false;
    this.ultimoAgendamentoCriado = null;
  }

  retornarAoSite() {
    this.router.navigate(['/']);
  }
}