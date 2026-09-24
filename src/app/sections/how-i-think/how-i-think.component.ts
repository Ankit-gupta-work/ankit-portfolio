import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { THINK_CARDS } from '../../data/portfolio.data';

@Component({
  selector: 'app-how-i-think',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './how-i-think.component.html',
  styleUrl: './how-i-think.component.css',
})
export class HowIThinkComponent {
  readonly cards = THINK_CARDS;
}
