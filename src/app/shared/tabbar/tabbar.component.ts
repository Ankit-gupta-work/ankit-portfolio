import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tabbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabbar.component.html',
})
export class TabbarComponent {}
