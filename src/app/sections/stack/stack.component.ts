import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { AI_QUOTE, STACK_ROWS } from '../../data/portfolio.data';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stack.component.html',
})
export class StackComponent {
  readonly rows = STACK_ROWS;
  readonly quote = AI_QUOTE;
}
