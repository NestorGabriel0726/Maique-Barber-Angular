import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importante para liberar o envio do formulário (NgForm)
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css'
})
export class Agendamento {
  // Controle de exibição dos modais (Substitui o "hidden" do JS puro)
  isModalReservaAberto: boolean = false;
  isModalSucessoAberto: boolean = false;

  // Dados do Agendamento
  dataSelecionada: string = '';
  horarioSelecionado: string = '';
  nomeCliente: string = '';
  servicoEscolhido: string = '';

  // Lista simulada de horários da barbearia
  horariosDisponiveis: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
  ];

  // Função disparada quando o cliente clica em um horário do Grid
  selecionarHorario(horario: string) {
    this.horarioSelecionado = horario;
    this.isModalReservaAberto = true; // Abre o modal de confirmação
  }

  // Função para fechar o modal de formulário
  fecharModalReserva() {
    this.isModalReservaAberto = false;
    this.nomeCliente = '';
    this.servicoEscolhido = '';
  }

  // Função executada quando o formulário é enviado (Submit)
  confirmarAgendamento() {
    // Fecha o primeiro modal
    this.isModalReservaAberto = false;
    
    // Abre o modal de sucesso
    this.isModalSucessoAberto = true;
  }

  // Função para fechar o modal de sucesso e resetar a tela
  fecharModalSucesso() {
    this.isModalSucessoAberto = false;
    this.horarioSelecionado = '';
    // Aqui no futuro você pode limpar a data se quiser também
  }
}