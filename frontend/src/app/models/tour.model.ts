export interface Tour {
  id: number;
  name: string;
  description: string;
  start: string;
  destination: string;
  transportType: string;
  distance?: number;
  estimatedTime?: number;
  routeInformation?: string;
  popularity?: number;
  childFriendliness?: string;
  avgRating?: number;
  totalTime?: number;
  mostPopularTour?: string;
  imagePath?: string;
}
