import { Injectable, signal, computed } from '@angular/core';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class TourStateService {
  private _tours = signal<Tour[]>([]);
  private _selectedTour = signal<Tour | null>(null);
  private _loading = signal<boolean>(false);

  readonly tours = computed(() => this._tours());
  readonly selectedTour = computed(() => this._selectedTour());
  readonly loading = computed(() => this._loading());
  readonly tourCount = computed(() => this._tours().length);

  setTours(tours: Tour[]): void {
    this._tours.set(tours);
  }

  setSelectedTour(tour: Tour | null): void {
    this._selectedTour.set(tour);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  addTour(tour: Tour): void {
    this._tours.update((tours) => [...tours, tour]);
  }

  updateTour(updated: Tour): void {
    this._tours.update((tours) => tours.map((t) => (t.id === updated.id ? updated : t)));
  }

  removeTour(id: number): void {
    this._tours.update((tours) => tours.filter((t) => t.id !== id));
  }
}
