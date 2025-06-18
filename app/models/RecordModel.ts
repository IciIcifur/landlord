import {model, models, Schema} from "mongoose"

const RecordSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    objectId: {
        type: String,
        required: true,
        ref: "Object",
    },
    date: {
        type: String,
        required: true,
    },
    rent: {
        type: Number,
        min: [0, "Аренда не может быть отрицательной"],
        default: 0,
    },
    heat: {
        type: Number,
        min: [0, "Стоимость тепла не может быть отрицательной"],
        default: 0,
    },
    explotation: {
        type: Number,
        min: [0, "Стоимость содержания не может быть отрицательной"],
        default: 0,
    },
    mop: {
        type: Number,
        min: [0, "Стоимость МОП не может быть отрицательной"],
        default: 0,
    },
    renovation: {
        type: Number,
        min: [0, "Стоимость капремонта не может быть отрицательной"],
        default: 0,
    },
    tbo: {
        type: Number,
        min: [0, "Стоимость ТБО не может быть отрицательной"],
        default: 0,
    },
    electricity: {
        type: Number,
        min: [0, "Стоимость электричества не может быть отрицательной"],
        default: 0,
    },
    earthRent: {
        type: Number,
        min: [0, "Стоимость аренды земли не может быть отрицательной"],
        default: 0,
    },
    otherExpenses: {
        type: Number,
        default: 0,
    },
    otherIncomes: {
        type: Number,
        default: 0,
    },
    security: {
        type: Number,
        min: [0, "Стоимость охраны не может быть отрицательной"],
        default: 0,
    },
})

const RecordModel = models.Record || model("Record", RecordSchema)

export default RecordModel
