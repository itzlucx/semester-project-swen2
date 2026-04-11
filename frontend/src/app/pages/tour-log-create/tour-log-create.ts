import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TourLogService} from '../../services/tour-log';

@Component({
  selector: 'app-tour-log-create',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './tour-log-create.html',
  styleUrl: './tour-log-create.css',
})
export class TourLogCreate implements OnInit {
  form!: FormGroup;
  tourId!: number;
  logId?: number;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private logservice: TourLogService,
  ) {}

  ngOnInit(): void {
    // Route-Parameter abonnieren
    this.route.paramMap.subscribe(params => {

      // Tour-ID holen
      this.tourId = Number(params.get('tourId'));

      // Log-ID holen
      const logIdParam = params.get('logId');
      this.logId = logIdParam ? Number(logIdParam) : undefined;

      // Formular erstellen
      this.form = this.fb.group({
        dateTime: ['', Validators.required],
        comment: [''],
        difficulty: ['medium', Validators.required],
        totalDistance: ['', [Validators.required, Validators.min(0)]],
        totalTime: ['', [Validators.required, Validators.min(0)]],
        rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      });

      //  Wenn Edit Mode → Formular befüllen
      if (this.logId) {
        this.isEditMode = true;

        const log = this.logservice.getLogById(this.logId);

        if (log) {
          this.form.patchValue({
            dateTime: log.dateTime,
            comment: log.comment,
            difficulty: log.difficulty,
            totalDistance: log.totalDistance,
            totalTime: log.totalTime,
            rating: log.rating
          });
        }
      }

    });
  }

  //  Speichern
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const logData = {
      id: this.logId ?? 0,
      tourId: this.tourId,
      dateTime: this.form.value.dateTime,
      comment: this.form.value.comment,
      difficulty: this.form.value.difficulty,
      totalDistance: Number(this.form.value.totalDistance),
      totalTime: Number(this.form.value.totalTime),
      rating: Number(this.form.value.rating),
    };

    if (this.isEditMode) {
      this.logservice.updateLog(logData);
    } else {
      this.logservice.addLog(logData);
    }

    this.router.navigate(['/tour', this.tourId]);
  }

  //  Abbrechen
  onCancel(): void {
    this.router.navigate(['/tour', this.tourId]);
  }
}
