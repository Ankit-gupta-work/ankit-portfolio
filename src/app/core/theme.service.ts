import { Injectable, PLATFORM_ID, Renderer2, RendererFactory2, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const THEMING_DURATION_MS = 260;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);

  private hostEl: HTMLElement | null = null;
  private theming: ReturnType<typeof setTimeout> | undefined;

  readonly theme = signal<Theme>('dark');

  registerHost(el: HTMLElement): void {
    this.hostEl = el;
    if (!this.isBrowser) return;

    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    const initial: Theme = saved === 'light' ? 'light' : 'dark';
    this.theme.set(initial);
    this.applyClass(initial);
    document.documentElement.classList.remove('pf-light-boot');
  }

  toggle(): void {
    if (!this.isBrowser || !this.hostEl) return;
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.renderer.addClass(this.hostEl, 'theming');
    this.theme.set(next);
    this.applyClass(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable */
    }
    clearTimeout(this.theming);
    this.theming = setTimeout(() => {
      if (this.hostEl) this.renderer.removeClass(this.hostEl, 'theming');
    }, THEMING_DURATION_MS);
  }

  private applyClass(theme: Theme): void {
    if (!this.hostEl) return;
    if (theme === 'light') {
      this.renderer.addClass(this.hostEl, 'light');
    } else {
      this.renderer.removeClass(this.hostEl, 'light');
    }
  }
}
