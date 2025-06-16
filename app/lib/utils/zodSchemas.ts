import z from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,}$/;
const commonRegex =
  /^[a-zA-Zа-яА-Я0-9 .,!?\-_:;()@#&%$*+=\[\]{}<>|\/\\\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F700-\u1F77F\u1F780-\u1F7FF\u1F800-\u1F8FF\u1F900-\u1F9FF\u1FA00-\u1FA6F\u1FA70-\u1FAFF\u2600-\u26FF\u2700-\u27BF]*$/;

export const LoginFormSchema = z.object({
  email: z
    .string()
    .nonempty('Адрес эл. почты обязателен')
    .max(100, 'Адрес эл. почты не может быть длиннее 100 символов')
    .email('Введите корректный адрес эл. почты')
    .regex(emailRegex, 'Введите корректный адрес эл. почты'),

  password: z
    .string()
    .nonempty('Пароль обязателен')
    .min(8, 'Пароль не может быть короче 8 символов')
    .max(20, 'Пароль не может быть длиннее 20 символов')
    .regex(passwordRegex, 'Введите корректный пароль'),
});

export const EditObjectFormSchema = z.object({
  name: z
    .string()
    .nonempty('Название объекта обязательно')
    .max(32, 'Название объекта не может быть длинее 32 символов')
    .regex(commonRegex, 'Введите корректное название'),

  address: z
    .string()
    .min(10, 'Адрес объекта обязателен и не может быть короче 10 символов')
    .max(100, 'Адрес объекта не может быть длиннее 100 символов')
    .regex(commonRegex, 'Введите корректный адрес'),

  square: z
    .number()
    .min(0, 'Площадь должна быть положительной')
    .max(500, 'Площадь объекта не может превышать 500 м. кв.'),
});
