import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tour } from '../models/tour.model';
import { TourStateService } from '../services/tour-state';
import { Observable, tap } from 'rxjs';

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
      },
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
      },
    });
  }

  // Tour erstellen (POST)
  createTour(tourData: Omit<Tour, 'id'>): Observable<Tour> {
    return this.http.post<Tour>(this.apiUrl, tourData).pipe(
      tap((newTour) => {
        // tap führt Code aus (update), bevor es Ergebnis an Komponente weitergibt
        this.state.addTour(newTour);
      })
    );
  }

  // Tour aktualisieren (PUT)
  updateTour(id: number, tourData: Partial<Tour>): Observable<Tour> {
    return this.http.put<Tour>(`${this.apiUrl}/${id}`, tourData).pipe(
      tap((updatedTour) => {
        this.state.updateTour(updatedTour);
        this.state.setSelectedTour(updatedTour);
      })
    );
  }

  // Tour löschen (DELETE)
  deleteTour(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.state.removeTour(id)));
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
      },
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
      error: (err) => console.error('Fehler beim Exportieren:', err),
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
      error: (err) => console.error('Fehler beim Importieren:', err),
    });
  }

  uploadTourImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    // 'file' muss so heißen wie Parameter im Spring Boot Controller (@RequestParam("file"))
    formData.append('file', file); 

    return this.http.post<{ url: string }>('http://localhost:8080/api/images/upload', formData);
  }
}
