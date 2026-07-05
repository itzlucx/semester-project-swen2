// import { Component, inject, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { TourList } from "../../components/tour-list/tour-list";
// import { Tour } from '../../models/tour.model';
// import { TourService } from '../../services/tour';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
//
// @Component({
//   selector: 'app-home',
//   imports: [TourList, MatButtonModule, MatToolbarModule, MatCardModule],
//   templateUrl: './home.html',
//   styleUrl: './home.css',
// })
// export class Home implements OnInit {
//   mockTours: Tour[] = [];
//
//   private tourService = inject(TourService);
//   private http = inject(HttpClient);
//
//   constructor() {
//     this.mockTours = this.tourService.getTours();
//   }
//
//   ngOnInit(): void {
//     console.log('Versuche Backend zu erreichen...');
//
//     this.http.get('http://localhost:8080/api/test', { responseType: 'text'})
//       .subscribe({
//         next: (data) => {
//           console.log('✅ BACKEND ANTWORT: ', data);
//         },
//         error: (err) => {
//           console.log('❌ BACKEND ANTWORT: ', err);
//         }
//       });
//   }
// }

import { Component, inject, OnInit, computed } from '@angular/core';
import { TourList } from '../../components/tour-list/tour-list';
import { TourService } from '../../services/tour';
import { TourStateService } from '../../services/tour-state';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import {DurationPipe} from '../../pipes/duration.pipe';

@Component({
  selector: 'app-home',
  imports: [
    TourList,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    DecimalPipe,
    DurationPipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private tourService = inject(TourService);
  protected state = inject(TourStateService);
  searchQuery = '';

  // --- Dashboard Statistiken berechnen ---
  totalTours = computed(() => this.state.tours().length);

  // Summe "popularity" aller Touren
  totalLogs = computed(() =>
    this.state.tours().reduce((sum, tour) => sum + (tour.popularity ?? 0), 0),
  );

  // Summe der KM aller Touren
  totalDistance = computed(() =>
    this.state.tours().reduce((sum, tour) => sum + (tour.distance ?? 0), 0),
  );

  avgRating = computed(() => {
    const tours = this.state.tours();
    if (tours.length === 0) return 0;
    const sum = tours.reduce((acc, t) => acc + (t.avgRating ?? 0), 0);
    return Math.round((sum / tours.length) * 10) / 10;
  });

  mostPopularTour = computed(() => {
    const tours = this.state.tours();
    if (tours.length === 0) return '-';
    return tours.reduce((best, tour) =>
      (tour.popularity ?? 0) > (best.popularity ?? 0) ? tour : best,
    ).name;
  });

  totalTime = computed(() => {
    return this.state.tours().reduce((sum, t) => sum + (t.totalTime ?? 0), 0);
  });

  ngOnInit(): void {
    this.tourService.loadTours();
  }

  onSearch(): void {
    this.tourService.searchTours(this.searchQuery);
  }

  onClear(): void {
    this.searchQuery = '';
    this.tourService.loadTours();
  }

  onExport(): void {
    this.tourService.exportTours();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.tourService.importTours(file);
      input.value = ''; // Input zurücksetzen damit selbe Datei mehrmals gewählt werden kann
    }
  }
}
