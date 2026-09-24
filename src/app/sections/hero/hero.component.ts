import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArchDiagramComponent } from './arch-diagram.component';
import { HERO, LINKS } from '../../data/portfolio.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ArchDiagramComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  readonly hero = HERO;
  readonly links = LINKS;
}
