import type {
  TelegramMessage,
  TelegramKeyboard,
  TelegramInlineKeyboardButton,
  TelegramCallbackQuery,
  CallbackData,
} from '@/app/lib/telegram/types';
import { SessionState } from '@/app/lib/telegram/types';
import type { TelegramSessionManager } from '@/app/lib/telegram/sessionManager';
import type { TelegramAPI } from '@/app/lib/telegram/api';
import { UserService } from '@/app/lib/telegram/services/userService';
import { ObjectService } from '@/app/lib/telegram/services/objectService';
import { ExcelService } from '@/app/lib/telegram/services/excelService';

export class TelegramCommandHandler {
  private sessionManager: TelegramSessionManager;
  private api: TelegramAPI;
  private userService: UserService;
  private objectService: ObjectService;
  private excelService: ExcelService;

  constructor(sessionManager: TelegramSessionManager, api: TelegramAPI) {
    this.sessionManager = sessionManager;
    this.api = api;
    this.userService = new UserService();
    this.objectService = new ObjectService();
    this.excelService = new ExcelService(this.objectService);
  }

  async handleCommand(
    chatId: number,
    command: string,
    message: TelegramMessage,
  ): Promise<void> {
    try {
      const [cmd] = command.split(' ');

      switch (cmd.toLowerCase()) {
        case '/start':
          await this.handleStart(chatId);
          break;
        case '/help':
          await this.handleHelp(chatId);
          break;
        default:
          await this.handleUnknownCommand(chatId);
      }
    } catch (error) {
      console.error(
        `Error handling command ${command} for chat ${chatId}:`,
        error,
      );
      await this.sendErrorMessage(
        chatId,
        'Произошла ошибка при обработке команды.',
      );
    }
  }

  async handleCallback(
    chatId: number,
    callbackData: string,
    callbackQuery: TelegramCallbackQuery,
  ): Promise<void> {
    try {
      const data = callbackData as CallbackData;

      switch (data) {
        case 'main_menu':
          await this.showMainMenu(chatId);
          break;
        case 'my_objects':
          await this.handleMyObjects(chatId);
          break;
        case 'export_single':
          await this.handleExportSingle(chatId);
          break;
        case 'export_all':
          await this.handleExportAll(chatId);
          break;
        case 'help':
          await this.handleHelp(chatId);
          break;
        case 'logout':
          await this.handleLogout(chatId);
          break;
        case 'start_login':
          await this.handleStartLogin(chatId);
          break;
        case 'confirm_export_all':
          await this.executeExportAll(chatId);
          break;
        default:
          if (callbackData.startsWith('export_object_')) {
            const objectId = callbackData.replace('export_object_', '');
            await this.handleExportObject(chatId, objectId);
          } else {
            await this.handleUnknownCallback(chatId);
          }
      }
    } catch (error) {
      console.error(
        `Error handling callback ${callbackData} for chat ${chatId}:`,
        error,
      );
      await this.sendErrorMessage(
        chatId,
        'Произошла ошибка при обработке действия.',
      );
    }
  }

  async handleRegularMessage(
    chatId: number,
    text: string,
    message: TelegramMessage,
  ): Promise<void> {
    try {
      const session = this.sessionManager.getSession(chatId);

      switch (session.state) {
        case SessionState.AwaitingEmail:
          await this.handleEmailInput(chatId, text);
          break;
        case SessionState.AwaitingPassword:
          await this.handlePasswordInput(chatId, text);
          break;
        case SessionState.Authenticated:
          await this.handleAuthenticatedMessage(chatId, text);
          break;
        default:
          await this.handleUnauthenticatedMessage(chatId);
      }
    } catch (error) {
      console.error(`Error handling message for chat ${chatId}:`, error);
      await this.sendErrorMessage(
        chatId,
        'Произошла ошибка при обработке сообщения.',
      );
    }
  }

  private async handleStart(chatId: number): Promise<void> {
    const isAuthenticated = this.sessionManager.isAuthenticated(chatId);

    if (isAuthenticated) {
      await this.showWelcomeBackMessage(chatId);
    } else {
      await this.showWelcomeMessage(chatId);
    }
  }

  private async showWelcomeMessage(chatId: number): Promise<void> {
    const keyboard: TelegramKeyboard = {
      inline_keyboard: [
        [{ text: '🔐 Войти в систему', callback_data: 'start_login' }],
        [{ text: '❓ Помощь', callback_data: 'help' }],
      ],
    };

    const welcomeText = `🏢 *Добро пожаловать в LandLord Bot!*

Этот бот поможет вам:
• 📋 Управлять объектами аренды
• 📊 Экспортировать отчеты в Excel
• 📈 Анализировать финансовые данные

Для начала работы войдите в систему:`;

    await this.api.sendMessage(chatId, welcomeText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }

  private async showWelcomeBackMessage(chatId: number): Promise<void> {
    const userId = this.sessionManager.getUserId(chatId);
    if (!userId) {
      await this.handleStart(chatId);
      return;
    }

    const user = await this.userService.getUserById(userId);
    const welcomeText = '🏢 Добро пожаловать обратно!';

    await this.api.sendMessage(chatId, welcomeText, {
      parse_mode: 'Markdown',
      reply_markup: this.api.createMainMenuKeyboard(),
    });
  }

  private async showMainMenu(chatId: number): Promise<void> {
    if (!this.sessionManager.isAuthenticated(chatId)) {
      await this.handleStart(chatId);
      return;
    }

    const userId = this.sessionManager.getUserId(chatId);
    const user = userId ? await this.userService.getUserById(userId) : null;

    const menuText = `🏢 *LandLord Bot*

👤 Пользователь: ${user?.email || 'Неизвестен'}

Выберите действие:`;

    await this.api.sendMessage(chatId, menuText, {
      parse_mode: 'Markdown',
      reply_markup: this.api.createMainMenuKeyboard(),
    });
  }

  private async handleStartLogin(chatId: number): Promise<void> {
    if (this.sessionManager.isAuthenticated(chatId)) {
      await this.api.sendMessage(chatId, '✅ Вы уже авторизованы!');
      await this.showMainMenu(chatId);
      return;
    }

    this.sessionManager.updateSession(chatId, {
      state: SessionState.AwaitingEmail,
      tempData: { loginAttempts: 0 },
    });

    await this.api.sendMessage(
      chatId,
      '📧 *Вход в систему*\n\nВведите ваш email:',
      { parse_mode: 'Markdown' },
    );
  }

  private async handleEmailInput(chatId: number, email: string): Promise<void> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      await this.api.sendMessage(
        chatId,
        '❌ Неверный формат email. Пожалуйста, введите корректный email:',
      );
      return;
    }

    const session = this.sessionManager.getSession(chatId);
    this.sessionManager.updateSession(chatId, {
      state: SessionState.AwaitingPassword,
      tempData: { email, loginAttempts: session.tempData?.loginAttempts },
    });

    await this.api.sendMessage(chatId, '🔐 Теперь введите ваш пароль:');
  }

  private async handlePasswordInput(
    chatId: number,
    password: string,
  ): Promise<void> {
    const session = this.sessionManager.getSession(chatId);
    const email = session.tempData?.email;

    if (!email) {
      await this.api.sendMessage(
        chatId,
        '❌ Ошибка сессии. Начните заново с команды /start',
      );
      this.sessionManager.clearSession(chatId);
      return;
    }

    const authResponse = await this.userService.authenticateUser(
      email,
      password,
    );

    if (authResponse.success && authResponse.user) {
      await this.handleSuccessfulLogin(chatId, authResponse.user);
    } else {
      await this.handleFailedLogin(
        chatId,
        authResponse.error?.message || 'Неверные учетные данные',
      );
    }
  }

  private async handleSuccessfulLogin(
    chatId: number,
    user: any,
  ): Promise<void> {
    this.sessionManager.updateSession(chatId, {
      state: SessionState.Authenticated,
      userId: user.id,
      userRole: user.role,
      tempData: undefined,
    });

    await this.api.sendMessage(
      chatId,
      `✅ *Успешная авторизация!*\n\nДобро пожаловать!`,
      {
        parse_mode: 'Markdown',
        reply_markup: this.api.createMainMenuKeyboard(),
      },
    );
  }

  private async handleFailedLogin(
    chatId: number,
    errorMessage: string,
  ): Promise<void> {
    const session = this.sessionManager.getSession(chatId);
    const attempts = (session.tempData?.loginAttempts || 0) + 1;
    const maxAttempts = 3;

    if (attempts >= maxAttempts) {
      this.sessionManager.clearSession(chatId);
      await this.api.sendMessage(
        chatId,
        '❌ Слишком много неудачных попыток входа. Начните заново с команды /start',
      );
    } else {
      this.sessionManager.updateSession(chatId, {
        state: SessionState.AwaitingEmail,
        tempData: { loginAttempts: attempts },
      });

      await this.api.sendMessage(
        chatId,
        `❌ ${errorMessage}\n\nПопытка ${attempts}/${maxAttempts}. Попробуйте войти еще раз. Введите email:`,
      );
    }
  }

  private async handleMyObjects(chatId: number): Promise<void> {
    if (!this.sessionManager.isAuthenticated(chatId)) {
      await this.requireAuthentication(chatId);
      return;
    }

    const userId = this.sessionManager.getUserId(chatId);
    const user = userId ? await this.userService.getUserById(userId) : null;

    if (!userId || !user) {
      await this.handleAuthenticationError(chatId);
      return;
    }

    const objects = await this.objectService.getUserObjects(
      userId,
      user.role || 'CLIENT',
    );

    if (objects.length === 0) {
      await this.api.sendMessage(chatId, '📭 У вас нет доступных объектов.', {
        reply_markup: this.api.createBackToMenuKeyboard(),
      });
      return;
    }

    let message = '🏢 *Ваши объекты:*\n\n';
    objects.forEach((obj, index) => {
      message += `${index + 1}. *${obj.name}*\n`;
      message += `   📍 ${obj.address}\n`;
      if (obj.square) {
        message += `   🏠 ${obj.square} м²\n`;
      }
      if (obj.description) {
        message += `   📝 ${obj.description}\n\n`;
      }
    });

    const keyboard: TelegramKeyboard = {
      inline_keyboard: [
        [
          { text: '📊 Экспорт одного', callback_data: 'export_single' },
          { text: '📋 Экспорт всех', callback_data: 'export_all' },
        ],
        [{ text: '⬅️ Главное меню', callback_data: 'main_menu' }],
      ],
    };

    await this.api.sendMessage(chatId, message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }

  private async handleExportSingle(chatId: number): Promise<void> {
    if (!this.sessionManager.isAuthenticated(chatId)) {
      await this.requireAuthentication(chatId);
      return;
    }

    const userId = this.sessionManager.getUserId(chatId);
    const user = userId ? await this.userService.getUserById(userId) : null;

    if (!userId || !user) {
      await this.handleAuthenticationError(chatId);
      return;
    }

    const objects = await this.objectService.getUserObjects(
      userId,
      user.role || 'CLIENT',
    );

    if (objects.length === 0) {
      await this.api.sendMessage(
        chatId,
        '📭 У вас нет доступных объектов для экспорта.',
        {
          reply_markup: this.api.createBackToMenuKeyboard(),
        },
      );
      return;
    }

    const buttons: TelegramInlineKeyboardButton[][] = [];

    for (let i = 0; i < objects.length; i += 2) {
      const row: TelegramInlineKeyboardButton[] = [];

      row.push({
        text: `📊 ${objects[i].name}`,
        callback_data: `export_object_${objects[i].id}`,
      });

      if (i + 1 < objects.length) {
        row.push({
          text: `📊 ${objects[i + 1].name}`,
          callback_data: `export_object_${objects[i + 1].id}`,
        });
      }

      buttons.push(row);
    }

    buttons.push([{ text: '⬅️ Назад', callback_data: 'main_menu' }]);

    const keyboard: TelegramKeyboard = { inline_keyboard: buttons };

    await this.api.sendMessage(
      chatId,
      '📊 *Экспорт объекта*\n\nВыберите объект для экспорта:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    );
  }

  private async handleExportAll(chatId: number): Promise<void> {
    if (!this.sessionManager.isAuthenticated(chatId)) {
      await this.requireAuthentication(chatId);
      return;
    }

    const userId = this.sessionManager.getUserId(chatId);
    const user = userId ? await this.userService.getUserById(userId) : null;

    if (!userId || !user) {
      await this.handleAuthenticationError(chatId);
      return;
    }

    const objects = await this.objectService.getUserObjects(
      userId,
      user.role || 'CLIENT',
    );

    if (objects.length === 0) {
      await this.api.sendMessage(
        chatId,
        '📭 У вас нет доступных объектов для экспорта.',
        {
          reply_markup: this.api.createBackToMenuKeyboard(),
        },
      );
      return;
    }

    const confirmKeyboard: TelegramKeyboard = {
      inline_keyboard: [
        [
          {
            text: '✅ Да, экспортировать',
            callback_data: 'confirm_export_all',
          },
          { text: '❌ Отмена', callback_data: 'main_menu' },
        ],
      ],
    };

    const confirmText = `📋 *Экспорт всех объектов*

Вы хотите экспортировать все ${objects.length} объект(ов)?

⚠️ Это может занять некоторое время для большого количества объектов.`;

    await this.api.sendMessage(chatId, confirmText, {
      parse_mode: 'Markdown',
      reply_markup: confirmKeyboard,
    });
  }

  private async executeExportAll(chatId: number): Promise<void> {
    const userId = this.sessionManager.getUserId(chatId);
    const user = userId ? await this.userService.getUserById(userId) : null;

    if (!userId || !user) {
      await this.handleAuthenticationError(chatId);
      return;
    }

    try {
      await this.api.sendMessage(
        chatId,
        '📊 Генерирую отчет по всем объектам... Это может занять время.',
      );

      const exportResult = await this.excelService.generateAllObjectsReport(
        userId,
        user.role || 'CLIENT',
      );

      await this.api.sendDocument(
        chatId,
        exportResult.buffer,
        exportResult.filename,
        '📋 Полный отчет по всем объектам\n\n✅ Готово!',
      );

      setTimeout(() => {
        this.showMainMenu(chatId);
      }, 1000);
    } catch (error) {
      console.error('Export all error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      await this.api.sendMessage(
        chatId,
        `❌ Ошибка при генерации отчета: ${errorMessage}`,
        {
          reply_markup: this.api.createBackToMenuKeyboard(),
        },
      );
    }
  }

  private async handleExportObject(
    chatId: number,
    objectId: string,
  ): Promise<void> {
    const userId = this.sessionManager.getUserId(chatId);
    const user = userId ? await this.userService.getUserById(userId) : null;

    if (!userId || !user) {
      await this.handleAuthenticationError(chatId);
      return;
    }

    try {
      await this.api.sendMessage(chatId, '📊 Генерирую Excel файл...');

      const exportResult = await this.excelService.generateObjectReport(
        objectId,
        userId,
        user.role || 'CLIENT',
      );

      const objectResponse = await this.objectService.getObjectById(
        objectId,
        userId,
        user.role || 'CLIENT',
      );

      const objectName =
        objectResponse.success && objectResponse.object
          ? objectResponse.object.name
          : 'Объект';

      await this.api.sendDocument(
        chatId,
        exportResult.buffer,
        exportResult.filename,
        `📊 Отчет по объекту: ${objectName}\n\n✅ Готово!`,
      );

      setTimeout(() => {
        this.showMainMenu(chatId);
      }, 1000);
    } catch (error) {
      console.error('Export object error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      await this.api.sendMessage(
        chatId,
        `❌ Ошибка при генерации отчета: ${errorMessage}`,
        {
          reply_markup: this.api.createBackToMenuKeyboard(),
        },
      );
    }
  }

  private async handleLogout(chatId: number): Promise<void> {
    this.sessionManager.clearSession(chatId);
    await this.api.sendMessage(
      chatId,
      '👋 Вы вышли из системы. Используйте /start для входа.',
    );
  }

  private async handleHelp(chatId: number): Promise<void> {
    const helpText = `🤖 *LandLord Bot - Справка*

*Основные функции:*
🏢 Просмотр ваших объектов аренды
📊 Экспорт отдельных объектов в Excel
📋 Экспорт всех объектов одним архивом

*Как пользоваться:*
1️⃣ Войдите в систему (кнопка "Войти")
2️⃣ Используйте кнопки для навигации
3️⃣ Экспортируйте нужные отчеты

*Команды:*
/start - Главное меню
/help - Эта справка`;

    const keyboard = this.sessionManager.isAuthenticated(chatId)
      ? this.api.createBackToMenuKeyboard()
      : {
          inline_keyboard: [
            [{ text: '🔐 Войти', callback_data: 'start_login' }],
          ],
        };

    await this.api.sendMessage(chatId, helpText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }

  private async handleAuthenticatedMessage(
    chatId: number,
    text: string,
  ): Promise<void> {
    await this.api.sendMessage(
      chatId,
      'Используйте кнопки меню для навигации или команду /help для справки.',
      {
        reply_markup: this.api.createMainMenuKeyboard(),
      },
    );
  }

  private async handleUnauthenticatedMessage(chatId: number): Promise<void> {
    await this.api.sendMessage(
      chatId,
      'Для начала работы войдите в систему. Используйте команду /start',
    );
  }

  private async handleUnknownCommand(chatId: number): Promise<void> {
    if (this.sessionManager.isAuthenticated(chatId)) {
      await this.showMainMenu(chatId);
    } else {
      await this.handleStart(chatId);
    }
  }

  private async handleUnknownCallback(chatId: number): Promise<void> {
    await this.api.sendMessage(
      chatId,
      'Неизвестное действие. Используйте кнопки меню.',
      {
        reply_markup: this.api.createBackToMenuKeyboard(),
      },
    );
  }

  private async requireAuthentication(chatId: number): Promise<void> {
    await this.api.sendMessage(chatId, '❌ Сначала войдите в систему', {
      reply_markup: {
        inline_keyboard: [[{ text: '🔐 Войти', callback_data: 'start_login' }]],
      },
    });
  }

  private async handleAuthenticationError(chatId: number): Promise<void> {
    this.sessionManager.clearSession(chatId);
    await this.api.sendMessage(
      chatId,
      '❌ Ошибка аутентификации. Войдите в систему заново.',
    );
    await this.handleStart(chatId);
  }

  private async sendErrorMessage(
    chatId: number,
    message: string,
  ): Promise<void> {
    try {
      await this.api.sendMessage(chatId, `❌ ${message}`, {
        reply_markup: this.api.createBackToMenuKeyboard(),
      });
    } catch (error) {
      console.error('Error sending error message:', error);
    }
  }
}
