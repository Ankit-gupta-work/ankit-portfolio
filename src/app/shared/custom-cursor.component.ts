import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cur" #cursor aria-hidden="true"><span class="cur-dot"></span></div>
  `,
  styleUrl: './custom-cursor.component.css',
})
export class CustomCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cursor', { static: true }) cursorRef!: ElementRef<HTMLElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly renderer = inject(Renderer2);
  private cleanupFns: (() => void)[] = [];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cur = this.cursorRef.nativeElement;

    this.zone.runOutsideAngular(() => {
      const onMove = (ev: MouseEvent) => {
        cur.style.transform = `translate3d(${ev.clientX}px,${ev.clientY}px,0)`;
        cur.style.opacity = '1';
      };
      const onOver = (ev: MouseEvent) => {
        const target = ev.target as HTMLElement | null;
        const hovering = target?.closest?.('a, button, [tabindex]');
        cur.setAttribute('data-hover', hovering ? '1' : '0');
      };
      const onLeave = () => {
        cur.style.opacity = '0';
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseover', onOver);
      document.addEventListener('mouseleave', onLeave);

      this.cleanupFns.push(
        () => document.removeEventListener('mousemove', onMove),
        () => document.removeEventListener('mouseover', onOver),
        () => document.removeEventListener('mouseleave', onLeave),
      );
    });
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach((fn) => fn());
  }
}
