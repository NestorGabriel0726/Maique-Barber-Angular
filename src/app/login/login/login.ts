import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../auth.service'; 

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
    telefone: '',
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
    
    // Se a pessoa já estiver logada e tentar abrir a tela de login, o sistema manda ela para o lugar certo
    if (this.authService.isLogado()) {
      const usuarioLogado = this.authService.getUsuarioLogado();
      
      // Se for o e-mail do chefe, joga ele direto pro painel dele
      if (usuarioLogado?.email.toLowerCase() === 'maique@barber.com') {
        this.router.navigate(['/dashboard']);
      } else {
        // Se for cliente comum, joga para a página home
        this.router.navigate(['/']);
      }
    }
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
    this.limparFormularioCadastro();
  }

  irParaLogin() {
    this.estadoTela = 'login';
    this.limparFormularioCadastro();
  }

  abrirModal(tipo: TipoModal) {
    this.modalAtivo = tipo;
  }

  fecharModal() {
    this.modalAtivo = null;
  }

  aplicarMascaraTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (valor.length > 11) valor = valor.slice(0, 11); // Não deixa passar de 11 números

    // Vai colocando os parênteses e o traço do telefone enquanto a pessoa digita
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)$/, '($1');
    }

    this.cadastroData.telefone = valor;
  }

  // Aqui é o botão de entrar que nós mudamos para fazer o desvio de rotas
  executarLogin() {
    if (!this.loginData.usuario || !this.loginData.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    // Chama aquela função do serviço que a gente atualizou para aceitar a conta mestre do chefe
    const loginBemSucedido = this.authService.fazerLogin(this.loginData.usuario, this.loginData.senha);
    
    if (loginBemSucedido) {
      const usuarioLogado = this.authService.getUsuarioLogado();
      alert(`Seja bem-vindo de volta, ${usuarioLogado?.nome}! Login efetuado com sucesso.`);
      
      // NOVA REGRA: Se quem acabou de logar for o chefe, abre a tela de dashboard dele
      if (this.loginData.usuario.toLowerCase() === 'maique@barber.com') {
        this.router.navigate(['/dashboard']);
      } else {
        // Se for um cliente normal, manda para a tela de home
        this.router.navigate(['/']);
      }
    } else {
      alert('E-mail ou senha incorretos. Por favor, tente novamente ou cadastre-se.');
    }
  }

  executarCadastro() {
    if (this.cadastroData.telefone.length < 14) {
      alert('Por favor, insira um telefone válido com DDD!');
      return;
    }

    if (this.cadastroData.senha.length < 6) {
      alert('A senha deve conter no mínimo 6 caracteres!');
      return;
    }

    if (this.cadastroData.senha !== this.cadastroData.confirmarSenha) {
      alert('As senhas digitadas não coincidem!');
      return;
    }

    if (!this.cadastroData.aceitouTermos) {
      alert('Você precisa aceitar os termos e políticas para prosseguir.');
      return;
    }

    const novoUsuario: Usuario = {
      nome: this.cadastroData.nome,
      email: this.cadastroData.email,
      telefone: this.cadastroData.telefone,
      senha: this.cadastroData.senha
    };

    const resultado = this.authService.cadastrar(novoUsuario);

    if (resultado.sucesso) {
      alert(resultado.mensagem);
      this.loginData.usuario = this.cadastroData.email; // Copia o e-mail lá para a caixinha de login para ajudar o usuário
      this.loginData.senha = '';
      this.irParaLogin();
    } else {
      alert(resultado.mensagem);
    }
  }

  loginGoogle() {
    const usuarioGoogle: Usuario = {
      nome: 'Gabriel do Google',
      email: 'gabriel.google@gmail.com',
      telefone: '(11) 98888-7777',
      senha: 'google_oauth_bypass'
    };

    this.authService.cadastrar(usuarioGoogle);
    this.authService.fazerLogin(usuarioGoogle.email, 'google_oauth_bypass');
    
    alert('Autenticação via Google realizada com sucesso!');
    this.router.navigate(['/agendamento']); // Como o Google cria cliente padrão, vai para o agendamento
  }

  retornarAoSite() {
    this.router.navigate(['/']);
  }

  private limparFormularioCadastro() {
    this.cadastroData = {
      nome: '',
      email: '',
      telefone: '',
      senha: '',
      confirmarSenha: '',
      aceitouTermos: false
    };
  }
}