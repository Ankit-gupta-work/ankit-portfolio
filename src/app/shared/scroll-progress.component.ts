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

function supportsScrollTimeline(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll(root)');
}

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="prog" #bar aria-hidden="true"></div>`,
  styleUrl: './scroll-progress.component.css',
})
export class ScrollProgressComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bar', { static: true }) barRef!: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private cleanup?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (supportsScrollTimeline()) return;

    const bar = this.barRef.nativeElement;
    bar.style.display = 'block';

    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        const progress = max > 0 ? doc.scrollTop / max : 0;
        bar.style.transform = `scaleX(${progress})`;
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
