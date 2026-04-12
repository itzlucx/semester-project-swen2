import { Component, inject, OnInit } from '@angular/core';
import { TourService } from '../../services/tour';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tour-create',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './tour-create.html',
  styleUrl: './tour-create.css',
})
export class TourCreate {

  private tourService = inject(TourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isEditMode = false;
  editTourId: number | null = null;

  // Form und Validation definieren:
  tourForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    distance: ['', [Validators.required, Validators.min(0.1)]],
    estimatedTime: ['', Validators.required]
  });

  ngOnInit(): void {
    // Schauen ob wir auf /tour/edit/:id sind
    this.editTourId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.editTourId) {
      this.isEditMode = true;
      const tourToEdit = this.tourService.getTourById(this.editTourId);

      if (tourToEdit) {
        this.tourForm.patchValue({
          name: tourToEdit.name,
          description: tourToEdit.description,
          distance: String(tourToEdit.distance),
          estimatedTime: tourToEdit.estimatedTime
        });
      }
    }
  }

  onSubmit() {
    if (this.tourForm.valid) {
      if (this.isEditMode && this.editTourId) {
        // Bearbeitung -> Update aufrufen
        this.tourService.updateTour(this.editTourId, this.tourForm.value as any);
        // Nach Update User zurück auf details schicken
        this.router.navigate(['/tour', this.editTourId])
      } else {
        // Neu -> Add aufrufen
        this.tourService.addTour(this.tourForm.value as any);
        this.router.navigate(['/home']);
      }
    } else {
      console.log('Formular hat Fehler und wird nicht abgeschickt!');
      this.tourForm.markAllAsTouched();
    }
  }
}
