import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-auth.html',
  styleUrl: './login-auth.css'
})
export class LoginAuth {
  // Controla se a tela exibe o Login ou o Cadastro
  modoCadastro: boolean = false;

  // Dados do formulário
  nomeCompleto: string = '';
  email: string = '';
  senhaLocal: string = '';
  confirmarSenhaLocal: string = '';

  constructor(private router: Router) {}

  // Altera entre as telas com um efeito suave
  alternarModo() {
    this.modoCadastro = !this.modoCadastro;
    this.limparCampos();
  }

  limparCampos() {
    this.nomeCompleto = '';
    this.email = '';
    this.senhaLocal = '';
    this.confirmarSenhaLocal = '';
  }

  // Função provisória que vai simular o envio antes do Firebase
  submeterFormulario() {
    if (this.modoCadastro) {
      console.log('Tentando cadastrar:', this.nomeCompleto, this.email);
      // Aqui entrará a lógica de criar usuário no Firebase
    } else {
      console.log('Tentando logar com:', this.email);
      
      // SIMULAÇÃO DO BARBEIRO (Para você testar a rota depois)
      if (this.email === 'maique@barber.com') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/agendamento']);
      }
    }
  }

  // Função provisória para o clique do Google
  loginComGoogle() {
    console.log('Iniciando login com o Google...');
  }
}