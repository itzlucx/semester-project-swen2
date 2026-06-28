import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TourCreate } from './pages/tour-create/tour-create';
import { TourDetail } from './pages/tour-detail/tour-detail';
import { TourLogCreate } from './pages/tour-log-create/tour-log-create';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'tour/create', component: TourCreate, canActivate: [authGuard] },
  { path: 'tour/:id', component: TourDetail, canActivate: [authGuard] },
  { path: 'tour/edit/:id', component: TourCreate, canActivate: [authGuard] },
  { path: 'tour/:tourId/new-log', component: TourLogCreate, canActivate: [authGuard] },
  { path: 'tour/:tourId/log/:logId/edit', component: TourLogCreate, canActivate: [authGuard] },
];
