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

  // Create new tour
  addTour(newTourData: Omit<Tour, 'id'>): void {

    // Random id (zwischen 1 und 1000)
    const newId = Math.floor(Math.random() * 100) + 1;

    // Tour zusammenbauen
    const newTour: Tour = {
      ...newTourData,
      id: newId
    };

    // Ins Array pushen
    this.mockTours.push(newTour);
    console.log('Tour hinzugefügt! Aktuelle Touren:', this.mockTours);
  }
}
