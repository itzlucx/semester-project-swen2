import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TourCreate } from './pages/tour-create/tour-create';
import { TourDetail } from './pages/tour-detail/tour-detail';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: Home },
    { path: 'tour/create', component: TourCreate},
    { path: 'tour/:id', component: TourDetail}
];
