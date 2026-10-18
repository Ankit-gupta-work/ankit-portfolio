import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IsometricStackComponent } from './isometric-stack.component';
import { HERO, LINKS } from '../../data/portfolio.data';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [IsometricStackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  readonly hero = HERO;
  readonly links = LINKS;
}
