import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';
import { FEATURED_PROJECT, LINKS, SECONDARY_PROJECTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  readonly featured = FEATURED_PROJECT;
  readonly secondaryProjects = SECONDARY_PROJECTS;
  readonly links = LINKS;
}
