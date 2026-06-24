import { Injectable, inject } from '@angular/core';
import { TourLog } from '../models/tourlog.model';
import { TourLogStateService } from './tour-log-state';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {
  private state = inject(TourLogStateService);

  loadLogs(tourId: number): void {

  }

  //  Log hinzufügen
  createLog(tourId: number, logData: Omit<TourLog, 'id'>): void {
    const newLog: TourLog = { ...logData, id: Date.now() };
    this.state.addLog(newLog);
  }

  // Log löschen
  deleteLog(tourId: number, id: number): void {
    this.state.removeLog(id);
  }

  // Log updaten
  updateLog(tourId: number, log: TourLog): void {
    this.state.updateLog(log);
  }
}
