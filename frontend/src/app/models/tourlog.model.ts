export interface TourLog {
  id: number;
  dateTime: Date;
  comment: string;
  difficulty: 'easy' | 'medium' | 'hard';
  totalDistance: number;
  totalTime: number;
  rating: number;
}
