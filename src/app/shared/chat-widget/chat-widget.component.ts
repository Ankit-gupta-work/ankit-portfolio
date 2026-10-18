import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  Signal,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChatMessage, ChatService } from './chat.service';
import { renderSafeMarkdown } from './safe-markdown';

const MAX_INPUT_LENGTH = 500;
const COUNTER_THRESHOLD = 400;
const AUTO_SCROLL_THRESHOLD_PX = 80;

const SUGGESTIONS = [
  "What's his current role at Setu Net Pvt Ltd?",
  "What's JobPing's architecture?",
  'Which stack does he use daily?',
  'Is he open to relocating?',
  'How do I contact him?',
];

interface RenderedMessage extends ChatMessage {
  html: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.css',
})
export class ChatWidgetComponent implements AfterViewChecked {
  @ViewChild('launcherBtn') launcherBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('panelInput') panelInput?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messageList') messageList?: ElementRef<HTMLDivElement>;

  private readonly chat = inject(ChatService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isOpen = signal(false);
  readonly inputText = signal('');
  readonly suggestions = SUGGESTIONS;
  readonly maxLength = MAX_INPUT_LENGTH;
  readonly counterThreshold = COUNTER_THRESHOLD;

  readonly isStreaming = this.chat.isStreaming;
  /** Suggestions the visitor hasn't already asked, shown again under the latest answer. */
  readonly remainingSuggestions = computed(() => {
    const asked = new Set(this.chat.messages().filter((m) => m.role === 'user').map((m) => m.content));
    return SUGGESTIONS.filter((s) => !asked.has(s));
  });
  readonly messages: Signal<RenderedMessage[]> = computed(() =>
    this.chat.messages().map((m) => ({ ...m, html: renderSafeMarkdown(m.content) })),
  );

  readonly canSend = computed(
    () => !this.isStreaming() && this.inputText().trim().length > 0 && this.inputText().length <= this.maxLength,
  );

  private shouldAutoScroll = true;
  private lastMessageCount = 0;

  ngAfterViewChecked(): void {
    const list = this.messageList?.nativeElement;
    if (!list) return;

    const currentCount = this.chat.messages().length;
    if (currentCount !== this.lastMessageCount || this.isStreaming()) {
      this.lastMessageCount = currentCount;
      if (this.shouldAutoScroll) {
        list.scrollTop = list.scrollHeight;
      }
    }
  }

  onMessageListScroll(): void {
    const list = this.messageList?.nativeElement;
    if (!list) return;
    const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight;
    this.shouldAutoScroll = distanceFromBottom < AUTO_SCROLL_THRESHOLD_PX;
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.shouldAutoScroll = true;
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.panelInput?.nativeElement.focus());
      }
    } else {
      this.launcherBtn?.nativeElement.focus();
    }
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.launcherBtn?.nativeElement.focus();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  onInputChange(value: string): void {
    this.inputText.set(value);
    this.autoGrow();
  }

  private autoGrow(): void {
    const el = this.panelInput?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 22;
    const maxHeight = lineHeight * 4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }

  sendSuggestion(text: string): void {
    this.inputText.set(text);
    this.submit();
  }

  submit(): void {
    if (!this.canSend()) return;
    const text = this.inputText().trim();
    this.inputText.set('');
    if (this.panelInput?.nativeElement) {
      this.panelInput.nativeElement.style.height = 'auto';
    }
    this.shouldAutoScroll = true;
    void this.chat.send(text);
  }

  stop(): void {
    this.chat.cancel();
  }
}
