import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TerminalLogComponent } from './terminal-log.component';
import { WorkerStatusService } from '../../core/worker-status.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { CURRENTLY_BUILDING, LINKS } from '../../data/portfolio.data';

@Component({
  selector: 'app-currently-building',
  standalone: true,
  imports: [TerminalLogComponent, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './currently-building.component.html',
  styleUrl: './currently-building.component.css',
})
export class CurrentlyBuildingComponent {
  readonly data = CURRENTLY_BUILDING;
  readonly links = LINKS;
  readonly workerStatus = inject(WorkerStatusService);
}
