import type { TelegramSession } from '@/app/lib/telegram/types';
import { SessionState } from '@/app/lib/telegram/types';

export class TelegramSessionManager {
  private sessions: Map<number, TelegramSession>;
  private readonly SESSION_TIMEOUT;

  constructor() {
    this.sessions = new Map();
    this.SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000); // every 5 minutes
  }

  private createNewSession(chatId: number): TelegramSession {
    const session = {
      chatId,
      state: SessionState.Idle,
      lastActivity: new Date(),
    };
    this.sessions.set(chatId, session);
    return session;
  }

  getSession(chatId: number): TelegramSession {
    let session = this.sessions.get(chatId);

    if (!session) {
      session = this.createNewSession(chatId);
    }

    if (Date.now() - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
      this.clearSession(chatId);
      session = this.createNewSession(chatId);
    }

    return session;
  }

  updateSession(chatId: number, updates: Partial<TelegramSession>): void {
    const session = this.getSession(chatId);
    Object.assign(session, updates, { lastActivity: new Date() });
    this.sessions.set(chatId, session);
  }

  clearSession(chatId: number): void {
    this.sessions.delete(chatId);
  }

  isAuthenticated(chatId: number): boolean {
    const session = this.getSession(chatId);
    return session.state === SessionState.Authenticated && !!session.userId;
  }

  getUserId(chatId: number): string | undefined {
    const session = this.getSession(chatId);
    return session.userId;
  }

  getUserRole(chatId: number): string | undefined {
    const session = this.getSession(chatId);
    return session.userRole;
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [chatId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(chatId);
      }
    }
  }
}
