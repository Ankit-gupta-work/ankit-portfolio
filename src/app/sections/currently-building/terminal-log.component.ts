import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CURRENTLY_BUILDING } from '../../data/portfolio.data';

@Component({
  selector: 'app-terminal-log',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal-log.component.html',
  styleUrl: './terminal-log.component.css',
})
export class TerminalLogComponent {
  readonly data = CURRENTLY_BUILDING;
}
