import {
  loginUser,
  getUserById as getUserById_,
  LoginResult,
  AuthUser,
  AuthError,
} from '@/app/lib/services/auth-service';

export interface AuthResponse {
  success: boolean;
  user?: LoginResult;
  error?: {
    message: string;
    field?: string;
    validationErrors?: Record<string, string>;
  };
}

export class UserService {
  async authenticateUser(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    try {
      const user = await loginUser({ email, password });
      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Ошибка аутентификации пользователя:', error);

      if (error instanceof AuthError) {
        return {
          success: false,
          error: {
            message: error.message,
            field: error.field,
            validationErrors: error.errors,
          },
        };
      }

      return {
        success: false,
        error: {
          message: 'Произошла внутренняя ошибка. Пожалуйста, попробуйте позже.',
        },
      };
    }
  }

  async getUserById(userId: string): Promise<AuthUser | null> {
    try {
      return await getUserById_(userId);
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}
