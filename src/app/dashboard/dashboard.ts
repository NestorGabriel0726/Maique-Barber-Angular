import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Agendamento {
  id: string;
  cliente: string;
  telefone: string;
  servico: string;
  valor: number;
  horario: string;
  status: 'Pendente' | 'Confirmado' | 'Concluido' | 'Cancelado';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  nomeBarbeiro: string = 'Maique';
  saudacaoPeriodo: string = 'Olá';
  
  // Controle reativo da animação de Boas-Vindas no Header
  exibirMensagemSucesso: boolean = true;

  agendaAbertaHoje: boolean = true;
  dataSelecionada: Date = new Date();
  
  // Propriedades estruturais para a navegação do Calendário Customizado
  anoAtual!: number;
  mesAtual!: number;
  nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  diasDoMes: (number | null)[] = [];

  // Mock de horários de trabalho para controle de bloqueio do barbeiro
  horariosTrabalho = [
    { hora: '09:00', ativo: true },
    { hora: '09:30', ativo: true },
    { hora: '10:00', ativo: true },
    { hora: '10:30', ativo: false }, // Iniciado como bloqueado para demonstração visual
    { hora: '11:00', ativo: true },
    { hora: '11:30', ativo: true },
  ];

  // Lista Mock inicial de Agendamentos para renderização em tempo real
  agendamentos: Agendamento[] = [
    { id: '1', cliente: 'Carlos Silva', telefone: '(71) 99999-1111', servico: 'Cabelo + Barba', valor: 80.00, horario: '09:00', status: 'Confirmado' },
    { id: '2', cliente: 'Lucas Andrade', telefone: '(71) 98888-2222', servico: 'Corte Degradê', valor: 50.00, horario: '09:30', status: 'Pendente' },
    { id: '3', cliente: 'Marcos Souza', telefone: '(71) 97777-3333', servico: 'Barboterapia', valor: 45.00, horario: '11:00', status: 'Concluido' },
  ];

  // Controle de estado para abertura do Modal de Ajustes
  modalAberto: boolean = false;
  agendamentoSelecionado!: Agendamento;

  ngOnInit() {
    this.definirSaudacao();
    
    // Captura o ano e mês baseado na data atual do sistema
    this.anoAtual = this.dataSelecionada.getFullYear();
    this.mesAtual = this.dataSelecionada.getMonth();
    this.gerarCalendario();

    // Dispara o temporizador blindado para transição suave de 2 segundos
    this.iniciarTemporizadorBoasVindas();
  }

  definirSaudacao() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) this.saudacaoPeriodo = 'Bom dia';
    else if (hora >= 12 && hora < 18) this.saudacaoPeriodo = 'Boa tarde';
    else this.saudacaoPeriodo = 'Boa noite';
  }

  iniciarTemporizadorBoasVindas() {
    setTimeout(() => {
      this.exibirMensagemSucesso = false;
    }, 2000); // 2000ms = 2 segundos cravados
  }

  /* ==========================================================================
     ALGORITMO DO CALENDÁRIO MATRICIAL (SÊNIOR)
     ========================================================================== */
  gerarCalendario() {
    this.diasDoMes = [];
    const primeiroDiaMes = new Date(this.anoAtual, this.mesAtual, 1).getDay();
    const totalDiasNoMes = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();

    // Cria os blocos vazios necessários para alinhar o dia 1 ao dia correto da semana (D, S, T...)
    for (let i = 0; i < primeiroDiaMes; i++) {
      this.diasDoMes.push(null);
    }

    // Preenche a matriz com os dias reais do mês atual
    for (let dia = 1; dia <= totalDiasNoMes; dia++) {
      this.diasDoMes.push(dia);
    }
  }

  mudarMes(direcao: number) {
    this.mesAtual += direcao;
    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    } else if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }
    this.gerarCalendario();
  }

  selecionarDia(dia: number) {
    this.dataSelecionada = new Date(this.anoAtual, this.mesAtual, dia);
    console.log('Filtrando agendamentos localmente para:', this.dataSelecionada.toLocaleDateString('pt-BR'));
    // Integração futura: Disparar requisição ao Firebase passando "this.dataSelecionada"
  }

  isDiaSelecionado(dia: number | null): boolean {
    if (!dia) return false;
    return this.dataSelecionada.getDate() === dia &&
           this.dataSelecionada.getMonth() === this.mesAtual &&
           this.dataSelecionada.getFullYear() === this.anoAtual;
  }

  /* ==========================================================================
     GETTERS REATIVOS DA CARTEIRA FINANCEIRA (KPIs)
     ========================================================================== */
  get valorProjetado(): number {
    return this.agendamentos
      .filter(a => a.status !== 'Cancelado')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }

  get valorReal(): number {
    return this.agendamentos
      .filter(a => a.status === 'Concluido')
      .reduce((acc, curr) => acc + curr.valor, 0);
  }

  /* ==========================================================================
     AÇÕES OPERACIONAIS DO FLUXO DE TRABALHO
     ========================================================================== */
  alterarStatus(id: string, novoStatus: 'Confirmado' | 'Concluido' | 'Cancelado') {
    const agend = this.agendamentos.find(a => a.id === id);
    if (agend) {
      agend.status = novoStatus;
    }
  }

  alternarHorarioConfig(index: number) {
    this.horariosTrabalho[index].ativo = !this.horariosTrabalho[index].ativo;
  }

  abrirEdicao(agendamento: Agendamento) {
    this.agendamentoSelecionado = { ...agendamento }; // Clone estrutural para evitar alteração direta sem salvar
    this.modalAberto = true;
  }

  salvarEdicao() {
    const index = this.agendamentos.findIndex(a => a.id === this.agendamentoSelecionado.id);
    if (index !== -1) {
      this.agendamentos[index] = this.agendamentoSelecionado;
    }
    this.modalAberto = false;
  }
}