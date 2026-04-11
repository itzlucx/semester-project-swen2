import { Component, computed, Input } from '@angular/core';
import { TourLogService} from '../../services/tour-log';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-log-list',
  imports: [],
  templateUrl: './tour-log-list.html',
  styleUrl: './tour-log-list.css',
})
export class TourLogList {
  @Input() tourId!: number;

  logs;

  constructor(
    private logService: TourLogService,
    private router: Router,
  ) {
    this.logs = computed(() =>
      this.logService
        .getAllLogs()()
        .filter((log) => log.tourId === this.tourId),
    );

  }

  onDelete(id: number) {
    this.logService.deleteLog(id);
  }

  onEdit(id: number) {
    this.router.navigate(['/tour', this.tourId, 'log', id, 'edit']);
  }
}
