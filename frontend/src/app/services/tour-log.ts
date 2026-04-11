import { Injectable, signal, computed } from '@angular/core';
import { TourLog } from '../models/tourlog.model';

@Injectable({
  providedIn: 'root',
})
export class TourLogService {
  private logs = signal<TourLog[]>([]);

  // Getter für alle Logs
  getAllLogs() {
    return this.logs;
  }

  //  Log hinzufügen
  addLog(log: TourLog) {
    log.id = Date.now();
    this.logs.update((logs) => [...logs, log]);
  }

  // Log löschen
  deleteLog(id: number) {
    this.logs.update((logs) => logs.filter((l) => l.id !== id));
  }

  // Log holen (für bearbeiten)
  getLogById(id: number): TourLog | undefined {
    return this.logs().find((l) => l.id === id);
  }

  // Log updaten
  updateLog(updatedLog: TourLog) {
    this.logs.update((logs) => logs.map((l) => (l.id === updatedLog.id ? updatedLog : l)));
  }
}
