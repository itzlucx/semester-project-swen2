import { Component, computed, Input, OnInit, inject } from '@angular/core';
import { TourLogService} from '../../services/tour-log';
import { Router } from '@angular/router';
import { TourLogStateService } from '../../services/tour-log-state';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tour-log-list',
  imports: [MatButtonModule],
  templateUrl: './tour-log-list.html',
  styleUrl: './tour-log-list.css',
})
export class TourLogList implements OnInit {
  @Input() tourId!: number;

  private logService = inject(TourLogService);
  protected state = inject(TourLogStateService);
  private router = inject(Router);

  ngOnInit(): void {
    this.logService.loadLogs(this.tourId);
  }

  onDelete(id: number) {
    if (confirm('Bist du sicher, dass du dieses Log löschen möchtest?')) {
      this.logService.deleteLog(this.tourId, id);
    }
  }

  onEdit(id: number) {
    this.router.navigate(['/tour', this.tourId, 'log', id, 'edit']);
  }
}
