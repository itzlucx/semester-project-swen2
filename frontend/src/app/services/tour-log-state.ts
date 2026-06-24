import { Injectable, signal, computed } from '@angular/core';
import { TourLog } from '../models/tourlog.model';

@Injectable({
  providedIn: 'root',
})
export class TourLogStateService {
  private _logs = signal<TourLog[]>([]);

  readonly logs = computed(() => this._logs());

  addLog(log: TourLog): void {
    this._logs.update((logs) => [...logs, log]);
  }

  updateLog(updated: TourLog): void {
    this._logs.update((logs) => logs.map((l) => (l.id === updated.id ? updated : l)));
  }

  removeLog(id: number): void {
    this._logs.update((logs) => logs.filter((l) => l.id !== id));
  }

  getLogById(id: number): TourLog | undefined {
    return this._logs().find((l) => l.id === id);
  }
}
