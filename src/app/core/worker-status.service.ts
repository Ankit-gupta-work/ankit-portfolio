import { Injectable, NgZone, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const CYCLE_SECONDS = 7200;
const START_OFFSET_SECONDS = 2520; // 42 min

@Injectable({ providedIn: 'root' })
export class WorkerStatusService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly t0 = Date.now();
  private intervalId: ReturnType<typeof setInterval> | undefined;

  readonly lastRun = signal('42 min ago');
  readonly nextRun = signal('1h 18m 00s');

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.tick();
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.zone.run(() => this.tick()), 1000);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private tick(): void {
    const elapsed = (START_OFFSET_SECONDS + Math.floor((Date.now() - this.t0) / 1000)) % CYCLE_SECONDS;
    const left = CYCLE_SECONDS - elapsed;
    const h = Math.floor(left / 3600);
    const m = Math.floor((left % 3600) / 60);
    const s = left % 60;
    const mins = Math.floor(elapsed / 60);
    this.lastRun.set(mins < 1 ? 'just now' : `${mins} min ago`);
    this.nextRun.set(`${h ? h + 'h ' : ''}${m}m ${String(s).padStart(2, '0')}s`);
  }
}
