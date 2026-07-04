import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(hours: number | null | undefined): string {
    if (!hours) return '-';

    const totalMinutes = Math.round(hours * 60);
    const days = Math.floor(totalMinutes / 1440);
    const remainingMinutes = totalMinutes % 1440;
    const h = Math.floor(remainingMinutes / 60);
    const min = remainingMinutes % 60;

    if (days > 0) {
      return `${days}d ${h}h ${min}min`;
    } else if (h > 0) {
      return `${h}h ${min}min`;
    } else {
      return `${min}min`;
    }
  }
}
