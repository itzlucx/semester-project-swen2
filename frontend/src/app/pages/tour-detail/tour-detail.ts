import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TourService } from '../../services/tour';
import { Tour } from '../../models/tour.model';

import { MatButtonModule } from '@angular/material/button';
import { TourLogList } from '../../components/tour-log-list/tour-log-list';

@Component({
  selector: 'app-tour-detail',
  imports: [MatButtonModule, RouterLink, TourLogList],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
})
export class TourDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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

  onDelete(): void {
    if (this.tour) {
      const isConfirmed = confirm(`Bist du sicher, dass du "${this.tour.name}" löschen möchtest?`);

      if (isConfirmed) {
        // Im Service löschen
        this.tourService.deleteTour(this.tour.id);
        // User zu /home navigieren
        this.router.navigate(['/home']);
      }
    }
  }
}
