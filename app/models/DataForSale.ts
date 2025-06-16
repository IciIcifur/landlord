import {model, models, Schema} from 'mongoose';

const DataForSaleSchema = new Schema({
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
    recordId: {
        type: String,
        required: true,
        ref: 'Record',
    },
    purchasePrice: {
        type: Number,
        required: true,
    },
    priceForSale: {
        type: Number,
        required: true,
    },
    countOfMonth: {
        type: Number,
        default: null,
    },
    profitPerMonth: {
        type: Number,
        default: null,
    },
    totalProfit: {
        type: Number,
        default: null,
    },
    payback5Year: {
        type: Number,
        default: null,
    },
    payback7Year: {
        type: Number,
        default: null,
    },
    payback10Year: {
        type: Number,
        default: null,
    },
    percentPerYear: {
        type: Number,
        default: null,
    },
});

const DataForSaleModel = models.DataForSale || model('DataForSale', DataForSaleSchema);

export default DataForSaleModel;