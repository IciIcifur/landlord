export enum SessionState {
  Idle = 'idle',
  AwaitingEmail = 'awaiting_email',
  AwaitingPassword = 'awaiting_password',
  Authenticated = 'authenticated',
}

export interface TelegramSession {
  chatId: number;
  userId?: string;
  userRole?: string;
  state:
    | SessionState.Idle
    | SessionState.AwaitingEmail
    | SessionState.AwaitingPassword
    | SessionState.Authenticated;
  tempData?: {
    email?: string;
    loginAttempts?: number;
  };
  lastActivity: Date;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

export interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramChat {
  id: number;
  type: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramKeyboard {
  inline_keyboard: TelegramInlineKeyboardButton[][];
}

export interface TelegramInlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

export type CallbackData =
  | 'main_menu'
  | 'my_objects'
  | 'export_single'
  | 'export_all'
  | 'help'
  | 'logout'
  | 'start_login'
  | 'confirm_export_all'
  | `export_object_${string}`;
