import { Component, inject, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, effect, viewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TourService } from '../../services/tour';
import { TourStateService } from '../../services/tour-state';
import { MatButtonModule } from '@angular/material/button';
import { TourLogList } from '../../components/tour-log-list/tour-log-list';
import { DecimalPipe } from '@angular/common';
import * as L from 'leaflet';
import { DurationPipe } from '../../pipes/duration.pipe';

@Component({
  selector: 'app-tour-detail',
  imports: [MatButtonModule, RouterLink, TourLogList, DecimalPipe, DurationPipe],
  templateUrl: './tour-detail.html',
  styleUrl: './tour-detail.css',
})
export class TourDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tourService = inject(TourService);
  protected state = inject(TourStateService);

  mapElement = viewChild<ElementRef>('mapElement');
  private map: L.Map | null = null;

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    // Wenn sich selektierte Tour ändert (und routeInformation hat) zeichne die Karte
    effect(() => {
      const tour = this.state.selectedTour();
      const el = this.mapElement(); // TML-Element als Signal abrufen

      // Wenn Tour da ist und HTML Element auf dem Bildschirm erschienen ist:
      if (tour && tour.routeInformation && el) {
         this.initMap(tour.routeInformation, el.nativeElement);
      }
    });
  }

  ngOnInit(): void {
    this.state.setSelectedTour(null);
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.tourService.getTourById(id);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove(); // Aufräumen
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // nativeElement als Parameter übergeben
  private initMap(geoJsonString: string, htmlElement: any): void {
    if (this.map) {
      this.map.remove();
    }

    // übergebenes Element nutzen
    this.map = L.map(htmlElement);

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

      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          this.map?.invalidateSize();
        });
        // Auch hier übergebenes Element nutzen
        this.resizeObserver.observe(htmlElement);
      }

    } catch (e) {
      console.error("Konnte Geodaten nicht parsen", e);
    }
  }

  onDelete(): void {
    const tour = this.state.selectedTour();
    if (tour) {
      if (confirm(`Bist du sicher, dass du "${tour.name}" löschen möchtest?`)) {
        this.tourService.deleteTour(tour.id).subscribe({
          next: () => this.router.navigate(['/home']),
        });
      }
    }
  }
}
