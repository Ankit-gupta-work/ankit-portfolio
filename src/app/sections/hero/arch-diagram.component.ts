import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ARCH_DIAGRAM } from '../../data/portfolio.data';

@Component({
  selector: 'app-arch-diagram',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './arch-diagram.component.html',
  styleUrl: './arch-diagram.component.css',
})
export class ArchDiagramComponent {
  readonly diagram = ARCH_DIAGRAM;
}
