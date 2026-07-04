import { Injectable, signal, computed } from '@angular/core';
import { TourLog } from '../models/tourlog.model';

@Injectable({
  providedIn: 'root',
})
export class TourLogStateService {
  private _logs = signal<TourLog[]>([]);
  private _loading = signal<boolean>(false);

  readonly logs = computed(() => this._logs());
  readonly loading = computed(() => this._loading());

  setLogs(logs: TourLog[]): void {
    this._logs.set(logs);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

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

  clearLogs(): void {
    this._logs.set([]);
  }
}
