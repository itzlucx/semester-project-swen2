import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TourList } from "../../components/tour-list/tour-list";
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  imports: [TourList, MatButtonModule, MatToolbarModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  mockTours: Tour[] = [];

  private tourService = inject(TourService);
  private http = inject(HttpClient);

  constructor() {
    this.mockTours = this.tourService.getTours();
  }

  ngOnInit(): void {
    console.log('Versuche Backend zu erreichen...');

    this.http.get('http://localhost:8080/api/test', { responseType: 'text'})
      .subscribe({
        next: (data) => {
          console.log('✅ BACKEND ANTWORT: ', data);
        },
        error: (err) => {
          console.log('❌ BACKEND ANTWORT: ', err);
        }
      });
  }
}
