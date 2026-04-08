import { Injectable } from '@angular/core';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private mockTours: Tour[] = [
    { id: 1, name: 'Wienerwald Runde', description: 'Entspannte Runde', distance: 15.5, estimatedTime: '03:00' },
    { id: 2, name: 'Großglockner', description: 'Extrem steil!', distance: 48.0, estimatedTime: '05:30'}
  ];
  
  // Get all tours
  getTours(): Tour[] {
    return this.mockTours;
  }

  // Get one tour
  getTourById(id: number): Tour | undefined {
    return this.mockTours.find(tour => tour.id === id);
  }
}
