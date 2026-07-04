import type {
  TelegramUpdate,
  TelegramMessage,
  TelegramCallbackQuery,
} from '@/app/lib/telegram/types';
import { TelegramSessionManager } from '@/app/lib/telegram/sessionManager';
import { TelegramCommandHandler } from '@/app/lib/telegram/commandHandler';
import { TelegramAPI } from '@/app/lib/telegram/api';

export class TelegramBot {
  private sessionManager: TelegramSessionManager;
  private commandHandler: TelegramCommandHandler;
  private api: TelegramAPI;

  constructor() {
    this.sessionManager = new TelegramSessionManager();
    this.api = new TelegramAPI();
    this.commandHandler = new TelegramCommandHandler(
      this.sessionManager,
      this.api,
    );
  }

  async handleUpdate(update: TelegramUpdate): Promise<void> {
    try {
      if (update.message) {
        await this.handleMessage(update.message);
      } else if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query);
      }
    } catch (error) {
      console.error('Error handling Telegram update:', error);
    }
  }

  private async handleMessage(message: TelegramMessage): Promise<void> {
    try {
      const chatId = message.chat.id;
      const text = message.text?.trim();
      if (!text) return;

      if (text.startsWith('/')) {
        await this.commandHandler.handleCommand(chatId, text, message);
      } else {
        await this.commandHandler.handleRegularMessage(chatId, text, message);
      }
    } catch (err) {
      console.error('Error in handleMessage:', err);
    }
  }

  private async handleCallbackQuery(
    callbackQuery: TelegramCallbackQuery,
  ): Promise<void> {
    try {
      const chatId = callbackQuery.message?.chat.id;
      if (!chatId) return;

      await this.api.answerCallbackQuery(callbackQuery.id);

      await this.commandHandler.handleCallback(
        chatId,
        callbackQuery.data || '',
        callbackQuery,
      );
    } catch (err) {
      console.error('Error in handleCallbackQuery:', err);
    }
  }
}
