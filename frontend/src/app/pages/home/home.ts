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

import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  imports: [TourList, MatButtonModule, MatToolbarModule, MatCardModule, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private tourService = inject(TourService);
  protected state = inject(TourStateService);
  searchQuery = '';

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
}
