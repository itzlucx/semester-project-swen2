export interface Tour {
    id: number;
    name: string;
    description: string;
    start: string;
    destination: string;
    transportType: string;
    // distance: number; wird von OpenRouteservice API ausgerechnet
    // estimatedTime: string; wird von OpenRouteservice API ausgerechnet
    // routeInformation: string;
}