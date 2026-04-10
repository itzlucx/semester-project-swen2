import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TourCreate } from './pages/tour-create/tour-create';
import { TourDetail } from './pages/tour-detail/tour-detail';
import { TourLogCreate } from './pages/tour-log-create/tour-log-create';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'tour/create', component: TourCreate },
  { path: 'tour/:id', component: TourDetail },
  { path: 'tour/:id/new-log', component: TourLogCreate }
];
