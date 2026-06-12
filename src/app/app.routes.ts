import { Routes } from '@angular/router';
import { Agendamento } from './agendamento/agendamento';

export const routes: Routes = [
    // Rota inicial vazia não faz nada (deixa o app.html renderizar o site normal)
    { path: '', children: [] },

    // Rota que chama a página de agendamento
    { path: 'agendamento', component: Agendamento },

    // Se digitar qualquer coisa errada, volta para o início seguro
    { path: '**', redirectTo: '' }
];