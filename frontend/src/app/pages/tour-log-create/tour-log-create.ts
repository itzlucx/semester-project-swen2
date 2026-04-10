import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatError, MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tour-log-create',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatError, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './tour-log-create.html',
  styleUrl: './tour-log-create.css',
})
export class TourLogCreate implements OnInit {
  form!: FormGroup;
  tourId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    //  Tour-ID aus URL holen
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));

    //  Formular erstellen
    this.form = this.fb.group({
      dateTime: ['', Validators.required],
      comment: [''],
      difficulty: ['medium', Validators.required],
      totalDistanceKm: ['', [Validators.required, Validators.min(0)]],
      totalTimeMin: ['', [Validators.required, Validators.min(0)]],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  //  Speichern
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newLog = {
      ...this.form.value,
      tourId: this.tourId,
    };

    console.log('Neuer TourLog:', newLog);

    this.router.navigate(['/tour', this.tourId]);
  }

  //  Abbrechen
  onCancel(): void {
    this.router.navigate(['/tour', this.tourId]);
  }
}
