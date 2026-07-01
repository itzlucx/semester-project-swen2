// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { TourService } from '../../services/tour';
// import { Tour } from '../../models/tour.model';
//
// import { MatButtonModule } from '@angular/material/button';
// import { TourLogList } from '../../components/tour-log-list/tour-log-list';
//
// @Component({
//   selector: 'app-tour-detail',
//   imports: [MatButtonModule, RouterLink, TourLogList],
//   templateUrl: './tour-detail.html',
//   styleUrl: './tour-detail.css',
// })
// export class TourDetail implements OnInit {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private tourService = inject(TourService);
//
//   // Tour deklarieren (? erlaubt undefined)
//   tour?: Tour;
//
//   ngOnInit(): void {
//     // "Foto" von URL -> sucht nach Platzhalter ":id" aus app.routes.ts
//     const idFromUrl = Number(this.route.snapshot.paramMap.get('id'));
//
//     // Falls id gefunden -> tourService nach der zugehörigen Tour fragen
//     if (idFromUrl) {
//       this.tour = this.tourService.getTourById(idFromUrl);
//       console.log('Gefundene Tour: ', this.tour);
//     }
//   }
//
//   onDelete(): void {
//     if (this.tour) {
//       const isConfirmed = confirm(`Bist du sicher, dass du "${this.tour.name}" löschen möchtest?`);
//
//       if (isConfirmed) {
//         // Im Service löschen
//         this.tourService.deleteTour(this.tour.id);
//         // User zu /home navigieren
//         this.router.navigate(['/home']);
//       }
//     }
//   }
// }

import { Component, inject, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TourService } from '../../services/tour';
import { TourStateService } from '../../services/tour-state';
import { MatButtonModule } from '@angular/material/button';
import { TourLogList } from '../../components/tour-log-list/tour-log-list';
import { DecimalPipe } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-tour-detail',
  imports: [MatButtonModule, RouterLink, TourLogList, DecimalPipe],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
})
export class TourDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tourService = inject(TourService);
  protected state = inject(TourStateService);

  @ViewChild('mapElement') mapElement!: ElementRef;
  private map: L.Map | null = null;

  constructor() {
    // Wenn sich selektierte Tour ändert (und routeInformation hat) zeichne die Karte
    effect(() => {
      const tour = this.state.selectedTour();
      if (tour && tour.routeInformation && this.mapElement) {
         // Timeout damit DOM-Element sicher gerendert ist
         setTimeout(() => this.initMap(tour.routeInformation!), 0);
      }
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tourService.getTourById(id);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Aufräumen
    }
  }

  private initMap(geoJsonString: string): void {
    if (this.map) {
      this.map.remove(); // Falls schon eine existiert, löschen
    }

    this.map = L.map(this.mapElement.nativeElement);

    // Standard OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    try {
      const geoData = JSON.parse(geoJsonString);
      
      // blaue Route zeichnen
      const routeLayer = L.geoJSON(geoData, {
        style: { color: '#0047AB', weight: 5, opacity: 0.8 }
      }).addTo(this.map);

      // Map genau auf Ausmaße der Route zoomen
      this.map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

    } catch (e) {
      console.error("Konnte Geodaten nicht parsen", e);
    }
  }

  onDelete(): void {
    const tour = this.state.selectedTour();
    if (tour) {
      if (confirm(`Bist du sicher, dass du "${tour.name}" löschen möchtest?`)) {
        this.tourService.deleteTour(tour.id);
        this.router.navigate(['/home']);
      }
    }
  }
}
