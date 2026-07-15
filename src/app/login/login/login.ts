import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

type TelaAtiva = 'login' | 'cadastro';
type TipoModal = 'lgpd' | 'termos' | null;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  
  estadoTela: TelaAtiva = 'login';
  modalAtivo: TipoModal = null;
  isLightMode = false;

  loginData = {
    usuario: '',
    senha: ''
  };

  cadastroData = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceitouTermos: false
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.verificarTemaAtual();
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

  irParaCadastro() {
    this.estadoTela = 'cadastro';
    this.limparFormularios();
  }

  irParaLogin() {
    this.estadoTela = 'login';
    this.limparFormularios();
  }

  abrirModal(tipo: TipoModal) {
    this.modalAtivo = tipo;
  }

  fecharModal() {
    this.modalAtivo = null;
  }

  executarLogin() {
    if (!this.loginData.usuario || !this.loginData.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    this.authService.fazerLogin();
    alert(`Login efetuado com sucesso! Agora você pode realizar seus agendamentos.`);
    this.retornarAoSite();
  }

  executarCadastro() {
    if (this.cadastroData.senha !== this.cadastroData.confirmarSenha) {
      alert('As senhas digitadas não coincidem!');
      return;
    }

    alert('Conta criada com sucesso! Você será redirecionado para efetuar o login.');
    this.loginData.usuario = this.cadastroData.email;
    this.irParaLogin();
  }

  loginGoogle() {
    this.authService.fazerLogin();
    alert('Conectando à sua conta do Google...');
    this.retornarAoSite();
  }

  retornarAoSite() {
    this.router.navigate(['/']);
  }

  private limparFormularios() {
    this.cadastroData = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      aceitouTermos: false
    };
  }
}