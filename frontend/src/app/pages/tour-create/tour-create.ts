import { Component, inject, OnInit, signal } from '@angular/core';
import { TourService } from '../../services/tour';
import { TourStateService } from '../../services/tour-state';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tour-create',
  imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, DecimalPipe],
  templateUrl: './tour-create.html',
  styleUrl: './tour-create.css',
})
export class TourCreate implements OnInit {

  private tourService = inject(TourService);
  private tourState = inject(TourStateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  isEditMode = false;
  editTourId: number | null = null;

  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  selectedFile: File | null = null;
  imagePreviewUrl = signal<string | null>(null);

  tourForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', Validators.required],
    start: ['', Validators.required],
    destination: ['', Validators.required],
    transportType: ['', Validators.required]
  });

  ngOnInit(): void {
    this.editTourId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.editTourId) {
      this.isEditMode = true;

      this.tourService.getTourById(this.editTourId);
      const tourToEdit = this.tourState.selectedTour();

      if (tourToEdit) {
        this.tourForm.patchValue({
          name: tourToEdit.name,
          description: tourToEdit.description,
          start: tourToEdit.start,
          destination: tourToEdit.destination,
          transportType: tourToEdit.transportType
        });
      }
    }
  }

  onSubmit() {
    // Wenn Formular nicht gültig ist, Fehler anzeigen und abbrechen
    if (this.tourForm.invalid) {
      this.tourForm.markAllAsTouched();
      return;
    }

    // isLoading starten und alte Fehler löschen
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const tourData = this.tourForm.value as any;

    // Abfrage ob es Bild zum Upload gibt
    if (this.selectedFile) {
      this.tourService.uploadTourImage(this.selectedFile).subscribe({
        next: (response) => {
          // Backend liefert Pfad (zB /api/images/uuid.jpg)
          tourData.imagePath = response.url;
          // Tour mit Bild-Pfad im JSON speichern
          this.saveTour(tourData);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Bild-Upload fehlgeschlagen: ' + (err.error?.message || 'Unbekannter Fehler'));
        }
      });
    } else {
      // Wenn kein Bild ausgewählt dann direkt speichern
      this.saveTour(tourData);
    }
  }

  // Hilfsmethode für eigentliches Speichern
  private saveTour(tourData: any) {
    if (this.isEditMode && this.editTourId) {
      // Bearbeiten
      this.tourService.updateTour(this.editTourId, tourData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/tour', this.editTourId]);
        },
        error: (err) => this.handleError(err) // Fehler an Hilfsmethode leiten
      });
    } else {
      // Neu erstellen
      this.tourService.createTour(tourData).subscribe({
        next: () => { 
          this.isLoading.set(false);
          this.router.navigate(['/home']);
        },
        error: (err) => this.handleError(err) // Fehler an Hilfsmethode leiten
      });
    }
  }

  // Hilfsmethode (Fehler Code nicht zweimal schreiben)
  private handleError(err: any) {
    this.isLoading.set(false);
    if (err.status === 400) {
      this.errorMessage.set(err.error?.message || 'Start- oder Zielort wurde nicht gefunden.');
    } else {
      this.errorMessage.set('Ein unerwarteter Fehler ist aufgetreten. Bitte überprüfe deine Verbindung.');
    }
  }

  // Wird aufgerufen, wenn User Datei im HTML auswählt
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // 5 MB Limit (5 * 1024 * 1024)
      const maxSizeInBytes = 5242880; 

      if (file.size > maxSizeInBytes) {
        // Fehler anzeigen und Auswahl abbrechen
        this.errorMessage.set('Das ausgewählte Bild ist zu groß! Bitte wähle ein Bild unter 5 MB.');
        this.selectedFile = null;
        this.imagePreviewUrl.set(null);
        return;
      }

      // Wenns passt: Fehler löschen und Bild anzeigen
      this.errorMessage.set(null);
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => this.imagePreviewUrl.set(reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }
}