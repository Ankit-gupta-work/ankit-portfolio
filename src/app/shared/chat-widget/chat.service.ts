import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_TURNS_SENT = 10;
const FRIENDLY_NETWORK_ERROR =
  "Couldn't reach the assistant — email Ankit directly at [ankitjguptaforwork@gmail.com](mailto:ankitjguptaforwork@gmail.com).";
const FRIENDLY_RATE_LIMIT_ERROR =
  "You've asked a lot — try again in a bit, or email Ankit at [ankitjguptaforwork@gmail.com](mailto:ankitjguptaforwork@gmail.com).";

@Injectable({ providedIn: 'root' })
export class ChatService {
  readonly messages = signal<ChatMessage[]>([]);
  readonly isStreaming = signal(false);

  private abortController: AbortController | null = null;

  async send(userText: string): Promise<void> {
    this.messages.update((msgs) => [...msgs, { role: 'user', content: userText }, { role: 'assistant', content: '' }]);
    this.isStreaming.set(true);

    this.abortController = new AbortController();

    const conversation = this.messages()
      .slice(0, -1) // exclude the empty assistant placeholder we just added
      .slice(-MAX_TURNS_SENT);

    try {
      const response = await fetch(`${environment.apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
        signal: this.abortController.signal,
      });

      if (response.status === 429) {
        this.appendToLastAssistantMessage(FRIENDLY_RATE_LIMIT_ERROR);
        return;
      }

      if (!response.ok || !response.body) {
        this.appendToLastAssistantMessage(FRIENDLY_NETWORK_ERROR);
        return;
      }

      await this.readStream(response.body);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        this.appendToLastAssistantMessage(FRIENDLY_NETWORK_ERROR);
      }
    } finally {
      this.isStreaming.set(false);
      this.abortController = null;
    }
  }

  cancel(): void {
    this.abortController?.abort();
  }

  reset(): void {
    this.cancel();
    this.messages.set([]);
  }

  private async readStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const payload = line.slice('data:'.length).trim();
        if (payload === '[DONE]') return;

        try {
          const token = JSON.parse(payload) as string;
          this.appendToLastAssistantMessage(token);
        } catch {
          // Ignore malformed frames rather than breaking the stream.
        }
      }
    }
  }

  private appendToLastAssistantMessage(text: string): void {
    this.messages.update((msgs) => {
      const copy = [...msgs];
      const last = copy[copy.length - 1];
      if (last?.role === 'assistant') {
        copy[copy.length - 1] = { ...last, content: last.content + text };
      }
      return copy;
    });
  }
}
