import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tour } from '../models/tour.model';
import { TourStateService } from '../services/tour-state';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private state = inject(TourStateService);
  private http = inject(HttpClient);

  // Java-Backend
  private apiUrl = 'http://localhost:8080/api/tours';

  // Alle Touren laden (GET)
  loadTours(): void {
    this.state.setLoading(true);
    this.http.get<Tour[]>(this.apiUrl).subscribe({
      next: (tours) => {
        this.state.setTours(tours);
        this.state.setLoading(false);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Touren:', err);
        this.state.setLoading(false);
      }
    });
  }

  // Einzelne Tour laden (GET)
  getTourById(id: number): void {
    this.http.get<Tour>(`${this.apiUrl}/${id}`).subscribe({
      next: (tour) => {
        this.state.setSelectedTour(tour);
      },
      error: (err) => {
        console.error(`Fehler beim Laden der Tour ${id}:`, err);
        this.state.setSelectedTour(null);
      }
    });
  }

  // Tour erstellen (POST)
  createTour(tourData: Omit<Tour, 'id'>): void {
    this.http.post<Tour>(this.apiUrl, tourData).subscribe({
      next: (newTour) => {
        // Backend gibt fertige Tour (mit generierter Datenbank-ID) zurück
        this.state.addTour(newTour);
      },
      error: (err) => console.error('Fehler beim Erstellen der Tour:', err)
    });
  }

  // Tour aktualisieren (PUT)
  updateTour(id: number, tourData: Partial<Tour>): void {
    this.http.put<Tour>(`${this.apiUrl}/${id}`, tourData).subscribe({
      next: (updatedTour) => {
        this.state.updateTour(updatedTour);
        this.state.setSelectedTour(updatedTour);
      },
      error: (err) => console.error(`Fehler beim Bearbeiten der Tour ${id}:`, err)
    });
  }

  // Tour löschen (DELETE)
  deleteTour(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.state.removeTour(id);
      },
      error: (err) => console.error(`Fehler beim Löschen der Tour ${id}:`, err)
    });
  }

  searchTours(query: string): void {
    if (!query.trim()) {
      this.loadTours();
      return;
    }
    this.state.setLoading(true);
    this.http.get<Tour[]>(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`).subscribe({
      next: (tours) => {
        this.state.setTours(tours);
        this.state.setLoading(false);
      },
      error: (err) => {
        console.error('Fehler bei der Suche:', err);
        this.state.setLoading(false);
      }
    });
  }

  exportTours(): void {
  this.http.get(`${this.apiUrl}/export`, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tours_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error: (err) => console.error('Fehler beim Exportieren:', err)
  });
}

importTours(file: File): void {
  const formData = new FormData();
  formData.append('file', file);

  this.http.post(`${this.apiUrl}/import`, formData, { responseType: 'text' }).subscribe({
    next: (response) => {
      console.log(response);
      this.loadTours(); // Touren-Liste im UI neu laden damit importierten Touren erscheinen
    },
    error: (err) => console.error('Fehler beim Importieren:', err)
  });
}

}
