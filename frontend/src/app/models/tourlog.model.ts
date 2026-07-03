export interface TourLog {
  id: number;
  tourId: number;
  dateTime: string;
  comment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalDistance: number;
  totalTime: number;
  rating: number;
}
