import {model, models, Schema} from 'mongoose';

const RecordSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    objectId: {
        type: String,
        required: true,
        ref: 'Object',
    },
    date: {
        type: String,
        required: true,
    },
    rent: {
        type: Number,
        min: [0, 'Аренда не может быть отрицательной'],
        default: null,
    },
    heat: {
        type: Number,
        min: [0, 'Стоимость тепла не может быть отрицательной'],
        default: null,
    },
    explotation: {
        type: Number,
        min: [0, 'Стоимость содержания не может быть отрицательной'],
        default: null,
    },
    mop: {
        type: Number,
        min: [0, 'Стоимость МОП не может быть отрицательной'],
        default: null,
    },
    renovation: {
        type: Number,
        min: [0, 'Стоимость капремонта не может быть отрицательной'],
        default: null,
    },
    tbo: {
        type: Number,
        min: [0, 'Стоимость ТБО не может быть отрицательной'],
        default: null,
    },
    electricity: {
        type: Number,
        min: [0, 'Стоимость электричества не может быть отрицательной'],
        default: null,
    },
    earthRent: {
        type: Number,
        min: [0, 'Стоимость аренды земли не может быть отрицательной'],
        default: null,
    },
    otherExpenses: {
        type: Number,
        min: [0],
        default: null,
    },
    otherIncomes: {
        type: Number,
        min: [0],
        default: null,
    },
    security: {
        type: Number,
        min: [0, 'Стоимость охраны не может быть отрицательной'],
        default: null,
    },
});

const RecordModel = models.Record || model('Record', RecordSchema);

export default RecordModel;