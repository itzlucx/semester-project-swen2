import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour.model';

@Component({
  selector: 'app-tour-detail',
  imports: [],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
})
export class TourDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private tourService = inject(TourService);

  // Tour deklarieren (? erlaubt undefined)
  tour?: Tour;

  ngOnInit(): void {
    // "Foto" von URL -> sucht nach Platzhalter ":id" aus app.routes.ts
    const idFromUrl = Number(this.route.snapshot.paramMap.get('id'));

    // Falls id gefunden -> tourService nach der zugehörigen Tour fragen
    if (idFromUrl) {
      this.tour = this.tourService.getTourById(idFromUrl);
      console.log('Gefundene Tour: ', this.tour);
    }
  }
}
