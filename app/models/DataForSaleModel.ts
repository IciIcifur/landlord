import {model, models, Schema} from "mongoose"

const DataForSaleSchema = new Schema({
    objectId: {
        type: String,
        required: true,
        ref: "Object",
    },
    purchasePrice: {
        type: Number,
        required: true,
        min: [0, "Цена покупки не может быть отрицательной"],
    },
    priceForSale: {
        type: Number,
        required: true,
        min: [0, "Цена продажи не может быть отрицательной"],
    },
    countOfMonth: {
        type: Number,
        default: 0,
    },
    profitPerMonth: {
        type: Number,
        default: 0,
    },
    totalProfit: {
        type: Number,
        default: 0,
    },
    payback5Year: {
        type: Number,
        default: 0,
    },
    payback7Year: {
        type: Number,
        default: 0,
    },
    payback10Year: {
        type: Number,
        default: 0,
    },
    percentPerYear: {
        type: Number,
        default: 0,
    },
})

DataForSaleSchema.virtual("id").get(function () {
    return this._id.toHexString()
})

DataForSaleSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        delete ret._id
    },
})

const DataForSaleModel = models.DataForSale || model("DataForSale", DataForSaleSchema)

export default DataForSaleModel
