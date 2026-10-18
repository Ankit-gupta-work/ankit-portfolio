import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HERO_STACK, HERO_STACK_ARIA_LABEL } from '../../data/portfolio.data';

@Component({
  selector: 'app-isometric-stack',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './isometric-stack.component.html',
  styleUrl: './isometric-stack.component.css',
})
export class IsometricStackComponent {
  readonly layers = HERO_STACK;
  readonly ariaLabel = HERO_STACK_ARIA_LABEL;
}
