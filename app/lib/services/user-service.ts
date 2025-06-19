import UserModel, { UserRole } from '@/app/models/UserModel';
import ObjectModel from '@/app/models/ObjectModel';
import connectDB from '@/app/lib/utils/db';
import { hashPassword, validatePassword } from './auth-service';
import { transformMongooseDoc } from '@/app/lib/utils/transformMongooseDoc';

export interface CreateUserData {
  email: string;
  password: string;
}

export interface CreateUserResult {
  id: string;
  message: string;
}

export class UserServiceError extends Error {
  public errors?: Record<string, string>;

  constructor(
    message: string,
    public statusCode = 400,
    validationErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'UserServiceError';
    this.errors = validationErrors;
  }
}

export async function getUserById(userId: string) {
  await connectDB();
  if (!userId) {
    throw new UserServiceError('ID пользователя обязателен', 400);
  }
  try {
    const user = await UserModel.findById(userId).select('id email role').lean();
    if (!user) {
      throw new UserServiceError('Пользователь не найден', 404);
    }
    return transformMongooseDoc(user);
  } catch (error: any) {
    if (error instanceof UserServiceError) {
      throw error;
    }
    throw new UserServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function getAllUsers() {
  await connectDB();
  try {
    const users = await UserModel.find({}).select('id email role').lean();
    return transformMongooseDoc(users);
  } catch (error: any) {
    throw new UserServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function createOrUpdateUser(
  userData: CreateUserData,
): Promise<CreateUserResult> {
  await connectDB();
  const { email, password } = userData;
  const validationErrors: Record<string, string> = {};
  const passwordError = validatePassword(password);
  if (passwordError) validationErrors.password = passwordError;
  if (!email) validationErrors.email = 'Поле email обязательно';
  if (Object.keys(validationErrors).length) {
    throw new UserServiceError('Ошибки валидации', 400, validationErrors);
  }
  const hashedPassword = await hashPassword(password);
  try {
    const user = await UserModel.findOne({ email }).exec();
    if (user) {
      user.password = hashedPassword;
      await user.save();
      return { id: user.id, message: 'Пароль обновлен' };
    } else {
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        role: UserRole.CLIENT,
      });
      await newUser.save();
      return { id: newUser.id, message: 'Пользователь создан' };
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const mongooseErrors: Record<string, string> = {};
      for (const key in error.errors) {
        mongooseErrors[key] = error.errors[key].message;
      }
      throw new UserServiceError('Ошибки валидации', 400, mongooseErrors);
    }
    throw new UserServiceError(error.message || 'Ошибка на сервере', 500);
  }
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  await connectDB();
  if (!userId) {
    throw new UserServiceError('ID пользователя обязателен', 400, {
      id: 'ID пользователя обязателен',
    });
  }
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new UserServiceError('Пользователь не найден', 404, {
        id: 'Пользователь не найден',
      });
    }
    await ObjectModel.updateMany(
      { users: userId },
      { $pull: { users: userId } },
    );
    return { message: 'Пользователь удален' };
  } catch (error: any) {
    if (error instanceof UserServiceError) {
      throw error;
    }
    throw new UserServiceError(error.message || 'Ошибка на сервере', 500);
  }
}
