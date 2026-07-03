import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TourLogService} from '../../services/tour-log';
import { TourLogStateService } from '../../services/tour-log-state';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './tour-log-create.html',
  styleUrl: './tour-log-create.css',
})
export class TourLogCreate implements OnInit {
  form!: FormGroup;
  tourId!: number;
  logId?: number;
  isEditMode = false;

  fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private logservice = inject(TourLogService);
  private logState = inject(TourLogStateService);

  ngOnInit(): void {
    // Route-Parameter abonnieren
    this.route.paramMap.subscribe((params) => {
      // Tour-ID holen
      this.tourId = Number(params.get('tourId'));

      // Log-ID holen
      const logIdParam = params.get('logId');
      this.logId = logIdParam ? Number(logIdParam) : undefined;

      // Formular erstellen
      this.form = this.fb.group({
        date: ['', Validators.required],
        time: ['', Validators.required],
        comment: [''],
        difficulty: ['medium', Validators.required],
        totalDistance: ['', [Validators.required, Validators.min(0)]],
        totalTime: ['', [Validators.required, Validators.min(0)]],
        rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      });

      //  Wenn Edit Mode → Formular befüllen
      if (this.logId) {
        this.isEditMode = true;

        const log = this.logState.getLogById(this.logId);

        if (log) {
          // dateTime z.B. "2026-07-03T17:30:00" aufteilen
          const dateTimeParts = log.dateTime.split('T');
          const datePart = dateTimeParts[0]; // "2026-07-03"
          const timePart = dateTimeParts[1]?.slice(0, 5); // "17:30"

          this.form.patchValue({
            date: new Date(datePart),
            time: timePart,
            comment: log.comment,
            difficulty: log.difficulty,
            totalDistance: log.totalDistance,
            totalTime: log.totalTime,
            rating: log.rating,
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

    const date = this.form.value.date;
    const time = this.form.value.time;
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':');
    dateObj.setHours(Number(hours), Number(minutes), 0);

    // Statt toISOString() (UTC) -> manuell formatieren (lokale Zeit)
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDateTime =
      `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}` +
      `T${pad(Number(hours))}:${pad(Number(minutes))}:00`;

    const logData: Record<string, any> = {
      tourId: this.tourId,
      dateTime: formattedDateTime,
      comment: this.form.value.comment,
      difficulty: this.form.value.difficulty,
      totalDistance: Number(this.form.value.totalDistance),
      totalTime: Number(this.form.value.totalTime),
      rating: Number(this.form.value.rating),
    };

    if (this.isEditMode && this.logId) {
      logData['id'] = this.logId;
    }

    if (this.isEditMode) {
      this.logservice.updateLog(this.tourId, logData as any);
    } else {
      console.log('Sending logData:', JSON.stringify(logData));
      this.logservice.createLog(this.tourId, logData as any);
    }

    this.router.navigate(['/tour', this.tourId]);
  }

  //  Abbrechen
  onCancel(): void {
    this.router.navigate(['/tour', this.tourId]);
  }
}
