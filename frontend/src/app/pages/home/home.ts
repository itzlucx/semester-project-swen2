import { Component, inject } from '@angular/core';
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
export class Home {
  mockTours: Tour[] = [];

  private tourService = inject(TourService);

  constructor() {
    this.mockTours = this.tourService.getTours();
  }
}
