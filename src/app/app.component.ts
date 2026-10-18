import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, afterNextRender, inject } from '@angular/core';
import { ThemeService } from './core/theme.service';
import { ScrollSpyService } from './shared/scroll-spy.service';
import { ScrollProgressComponent } from './shared/scroll-progress.component';
import { CustomCursorComponent } from './shared/custom-cursor.component';
import { TabbarComponent } from './shared/tabbar/tabbar.component';
import { NavComponent } from './sections/nav/nav.component';
import { HeroComponent } from './sections/hero/hero.component';
import { CurrentlyBuildingComponent } from './sections/currently-building/currently-building.component';
import { ExperienceComponent } from './sections/experience/experience.component';
import { ProjectsComponent } from './sections/projects/projects.component';
import { HowIThinkComponent } from './sections/how-i-think/how-i-think.component';
import { StackComponent } from './sections/stack/stack.component';
import { ContactComponent } from './sections/contact/contact.component';
import { FooterComponent } from './sections/footer/footer.component';
import { ChatWidgetComponent } from './shared/chat-widget/chat-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ScrollProgressComponent,
    CustomCursorComponent,
    TabbarComponent,
    NavComponent,
    HeroComponent,
    CurrentlyBuildingComponent,
    ExperienceComponent,
    ProjectsComponent,
    HowIThinkComponent,
    StackComponent,
    ContactComponent,
    FooterComponent,
    ChatWidgetComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('appRoot', { static: true }) appRootRef!: ElementRef<HTMLElement>;

  private readonly theme = inject(ThemeService);
  private readonly scrollSpy = inject(ScrollSpyService);

  constructor() {
    afterNextRender(() => this.scrollSpy.start());
  }

  ngAfterViewInit(): void {
    this.theme.registerHost(this.appRootRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.scrollSpy.stop();
  }
}
