import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TourLog } from '../models/tourlog.model';
import { TourLogStateService } from './tour-log-state';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {
  private http = inject(HttpClient);
  private state = inject(TourLogStateService);

  private apiUrl(tourId: number): string {
    return `http://localhost:8080/api/tours/${tourId}/logs`;
  }

  loadLogs(tourId: number): void {
    this.state.setLoading(true);
    this.http.get<TourLog[]>(this.apiUrl(tourId)).subscribe({
      next: (logs) => {
        this.state.setLogs(logs);
        this.state.setLoading(false);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Logs:', err);
        this.state.setLoading(false);
      },
    });
  }

  createLog(tourId: number, logData: Omit<TourLog, 'id'>): void {
    this.http.post<TourLog>(this.apiUrl(tourId), logData).subscribe({
      next: (newLog) => this.state.addLog(newLog),
      error: (err) => console.error('Fehler beim Erstellen des Logs:', err),
    });
  }

  deleteLog(tourId: number, id: number): void {
    this.http.delete<void>(`${this.apiUrl(tourId)}/${id}`).subscribe({
      next: () => this.state.removeLog(id),
      error: (err) => console.error('Fehler beim Löschen des Logs:', err),
    });
  }

  updateLog(tourId: number, log: TourLog): void {
    this.http.put<TourLog>(`${this.apiUrl(tourId)}/${log.id}`, log).subscribe({
      next: (updated) => this.state.updateLog(updated),
      error: (err) => console.error('Fehler beim Updaten des Logs:', err),
    });
  }
}
