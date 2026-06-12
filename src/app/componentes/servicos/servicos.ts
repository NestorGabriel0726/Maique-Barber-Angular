import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [RouterLink, RouterModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css',
})
export class Servicos {}
