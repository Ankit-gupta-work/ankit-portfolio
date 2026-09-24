import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FOOTER } from '../../data/portfolio.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  readonly footer = FOOTER;
}
