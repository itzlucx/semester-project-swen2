import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tour } from "../../models/tour.model";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tour-list',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  @Input({ required: true }) tours: Tour[] = [];
}
