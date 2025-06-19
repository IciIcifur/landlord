import {model, models, Schema} from 'mongoose';

export enum UserRole {
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
}

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: [100, 'Адрес электронной почты не должен превышать 100 символов'],
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
    },
});

UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

const UserModel = models.User || model('User', UserSchema);

export default UserModel;