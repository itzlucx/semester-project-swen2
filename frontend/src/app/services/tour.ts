import { Injectable } from '@angular/core';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private mockTours: Tour[] = [
    { 
    id: 1, 
    name: 'Wienerwald Runde', 
    description: 'Entspannte Runde durch den Wald, perfekt für einen Sonntagnachmittag.', 
    start: 'Wien Hütteldorf', 
    destination: 'Sophienalpe', 
    transportType: 'Fahrrad' 
  },
  { 
    id: 2, 
    name: 'Großglockner Hochalpenstraße', 
    description: 'Anspruchsvolle Bergstrecke mit atemberaubender Aussicht und vielen Kurven.', 
    start: 'Fusch', 
    destination: 'Heiligenblut', 
    transportType: 'Auto' 
  }
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

  deleteTour(id: number): void {
    this.mockTours = this.mockTours.filter(t => t.id !== id);
    console.log('Tour gelöscht. Verbleibend:', this.mockTours.length);
  }

  updateTour(id: number, updatedData: Partial<Tour>): void {
    console.log('Service empfängt zum Speichern:', updatedData);
    // Index der Tour im Array suchen
    const index = this.mockTours.findIndex(t => t.id === id);
    console.log('Service findet Tour an Array-Position (Index):', index);

    if (index !== -1) {
      this.mockTours[index] = { ...this.mockTours[index], ...updatedData, id: id };
      console.log('Tour aktualisiert:', this.mockTours[index]);
    }
  }
}
