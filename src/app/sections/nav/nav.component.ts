import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../core/theme.service';
import { NAV_LINKS } from '../../data/portfolio.data';

const SCROLL_RANGE_PX = 80;

function supportsScrollTimeline(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll(root)');
}

@Component({
  selector: 'app-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements AfterViewInit, OnDestroy {
  @ViewChild('navEl', { static: true }) navRef!: ElementRef<HTMLElement>;

  readonly theme = inject(ThemeService);
  readonly navLinks = NAV_LINKS;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (supportsScrollTimeline()) return;

    const nav = this.navRef.nativeElement;
    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        const progress = Math.min(1, Math.max(0, window.scrollY / SCROLL_RANGE_PX));
        if (progress > 0) {
          nav.style.background = 'var(--nav-bg)';
          nav.style.borderBottomColor = 'var(--b)';
        } else {
          nav.style.background = 'transparent';
          nav.style.borderBottomColor = 'transparent';
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      this.cleanup = () => window.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}
