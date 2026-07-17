import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { Login } from './login/login/login';
import { Home } from './componentes/home/home'; 
import { AgendamentoComponent } from './agendamento/agendamento';
import { DashboardComponent } from './dashboard/dashboard'; 
import { AuthService } from './login/auth.service'; 

// lógica de proteção 
const apenasLogado = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  
  if (authService.isLogado()) {
    return true; 
  }

  // Se não estiver logado, barra e joga pro login
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  
  { path: '', component: Home, pathMatch: 'full' },

  // Rota da tela de Login
  { path: 'login', component: Login },

  // Rota da tela de agendamento (Protegida)
  { path: 'agendamento', component: AgendamentoComponent, canActivate: [apenasLogado] },

  // Rota do painel do Barbeiro (Protegida)
  { path: 'dashboard', component: DashboardComponent, canActivate: [apenasLogado] },

  // Qualquer link que não exista redireciona de volta para a Home
  { path: '**', redirectTo: '' }
];