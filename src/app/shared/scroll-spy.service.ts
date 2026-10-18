import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SECTION_IDS = ['experience', 'work', 'stack', 'think', 'contact'];

@Injectable({ providedIn: 'root' })
export class ScrollSpyService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private observer?: IntersectionObserver;

  /** Starts the scroll-spy. Call once from the root component after first render. */
  start(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!('IntersectionObserver' in window)) return;

    this.zone.runOutsideAngular(() => {
      const links = document.querySelectorAll<HTMLAnchorElement>('.tabbar a[data-sec], .navlinks a.nl');

      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const id = entry.target.id;
            links.forEach((a) => {
              a.setAttribute('aria-current', a.getAttribute('href') === `#${id}` ? 'true' : 'false');
            });
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) this.observer!.observe(el);
      }
    });
  }

  stop(): void {
    this.observer?.disconnect();
  }
}
