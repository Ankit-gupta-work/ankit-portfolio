import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { ThemeService } from './core/theme.service';
import { ScrollProgressComponent } from './shared/scroll-progress.component';
import { CustomCursorComponent } from './shared/custom-cursor.component';
import { NavComponent } from './sections/nav/nav.component';
import { HeroComponent } from './sections/hero/hero.component';
import { CurrentlyBuildingComponent } from './sections/currently-building/currently-building.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { HowIThinkComponent } from './sections/how-i-think/how-i-think.component';
import { StackComponent } from './sections/stack/stack.component';
import { ContactComponent } from './sections/contact/contact.component';
import { FooterComponent } from './sections/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ScrollProgressComponent,
    CustomCursorComponent,
    NavComponent,
    HeroComponent,
    CurrentlyBuildingComponent,
    ProjectsComponent,
    HowIThinkComponent,
    StackComponent,
    ContactComponent,
    FooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appRoot', { static: true }) appRootRef!: ElementRef<HTMLElement>;

  private readonly theme = inject(ThemeService);

  ngAfterViewInit(): void {
    this.theme.registerHost(this.appRootRef.nativeElement);
  }
}
