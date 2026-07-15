import { Routes } from '@angular/router';
import { Login } from './login/login/login';
import { Home } from './componentes/home/home'; 

export const routes: Routes = [
  
  { path: '', component: Home, pathMatch: 'full' },

  // Rota da tela de Login
  { path: 'login', component: Login },

  // Qualquer link que não exista redireciona de volta para a Home
  { path: '**', redirectTo: '' }
];