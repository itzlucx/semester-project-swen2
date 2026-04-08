import { Component, inject } from '@angular/core';
import { TourList } from "../../components/tour-list/tour-list";
import { RouterLink } from "@angular/router";
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour';

@Component({
  selector: 'app-home',
  imports: [TourList, RouterLink],
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
