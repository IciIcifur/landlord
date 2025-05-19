import {model, models, Schema} from 'mongoose';

export enum UserRole {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
  }

const UserSchema = new Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: [100, 'Адрес элктронной почты не должен превышать 100 символов'],
    },
    password: { 
        type: String, 
        required: true,
        minlength: [8, 'Пароль должен содержать минимум 8 символов'],
        maxlength: [20, 'Пароль не должен превышать 20 символов'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
            'Пароль должен содержать как минимум одну заглавную букву, одну строчную букву, одну цифру и один специальный символ (@$!%*?&)'],
    },
    role:{
        type: String,
        enum: Object.values(UserRole),
        required: true,
    },
    objectId: {
    type: String,
    required: true,
    ref: 'Object',
    },
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;