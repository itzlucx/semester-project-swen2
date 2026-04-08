import { Component, inject } from '@angular/core';
import { TourService } from '../../services/tour';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tour-create',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './tour-create.html',
  styleUrl: './tour-create.css',
})
export class TourCreate {

  private tourService = inject(TourService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Form und Validation definieren:
  tourForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    distance: ['', [Validators.required, Validators.min(0.1)]],
    estimatedTime: ['', Validators.required]
  });

  onSubmit() {
    if (this.tourForm.valid) {
      this.tourService.addTour(this.tourForm.value as any);
      this.router.navigate(['/home']);
    } else {
      console.log('Formular hat Fehler und wird nicht abgeschickt!');
      this.tourForm.markAllAsTouched();
    }
  }
}
