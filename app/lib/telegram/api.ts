import type { TelegramKeyboard } from '@/app/lib/telegram/types';
import fetch from 'node-fetch';

export class TelegramAPI {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables',
      );
    }
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
  }

  private async postToTelegram(
    endpoint: string,
    payload: FormData | any,
    headers?: Record<string, any>,
  ) {
    let actualHeaders: Record<string, string> = headers || {};

    if (payload instanceof FormData) {
      if ('Content-Type' in actualHeaders) {
        delete actualHeaders['Content-Type'];
      }
    } else if (!headers) {
      actualHeaders = { 'Content-Type': 'application/json' };
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'POST',
      headers: actualHeaders,
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[${endpoint}] Telegram API error:`, error);
    }

    return response;
  }

  async sendMessage(
    chatId: number,
    text: string,
    options?: {
      reply_markup?: TelegramKeyboard;
      parse_mode?: 'HTML' | 'Markdown';
    },
  ): Promise<void> {
    try {
      await this.postToTelegram('sendMessage', {
        chat_id: chatId,
        text,
        ...options,
      });
    } catch (error) {
      console.error(`[sendMessage] Error for chat ${chatId}:`, error);
    }
  }

  async sendDocument(
    chatId: number,
    document: Buffer,
    filename: string,
    caption?: string,
  ): Promise<void> {
    try {
      const form = new FormData();

      const blob = new Blob([document], { type: 'text/csv; charset=utf-8' });

      form.append('chat_id', chatId.toString());
      form.append('document', blob, filename);
      if (caption) form.append('caption', caption);

      await this.postToTelegram('sendDocument', form);
    } catch (error) {
      console.error(`[sendDocument] Error for chat ${chatId}:`, error);
    }
  }

  async answerCallbackQuery(
    callbackQueryId: string,
    text?: string,
  ): Promise<void> {
    try {
      await this.postToTelegram('answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        text,
      });
    } catch (error) {
      console.error('Error answering callback query:', error);
    }
  }

  createMainMenuKeyboard(): TelegramKeyboard {
    return {
      inline_keyboard: [
        [{ text: '🏢 Мои объекты', callback_data: 'my_objects' }],
        [
          { text: '📊 Экспорт одного', callback_data: 'export_single' },
          { text: '📋 Экспорт всех', callback_data: 'export_all' },
        ],
        [
          { text: '❓ Помощь', callback_data: 'help' },
          { text: '🚪 Выйти', callback_data: 'logout' },
        ],
      ],
    };
  }

  createBackToMenuKeyboard(): TelegramKeyboard {
    return {
      inline_keyboard: [
        [{ text: '⬅️ Главное меню', callback_data: 'main_menu' }],
      ],
    };
  }
}
