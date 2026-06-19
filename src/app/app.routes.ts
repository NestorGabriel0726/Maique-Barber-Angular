import { Routes } from '@angular/router';
import { Agendamento } from './agendamento/agendamento';
import { LoginAuth } from './componentes/login-auth/login-auth';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    // Rota inicial vazia não faz nada (deixa o app.html renderizar o site normal)
    { path: '', children: [] },

    { path: 'login', component: LoginAuth },

    // Rota que chama a página de agendamento
    { path: 'agendamento', component: Agendamento },

    { path: 'dashboard', component: Dashboard },

    // Se digitar qualquer coisa errada, volta para o início seguro
    { path: '**', redirectTo: '' }
];