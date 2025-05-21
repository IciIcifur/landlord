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
    },
    profitPerMonth: {
        type: Number,
    },
    totalProfit: {
        type: Number,
    },
    payback5Year: {
        type: Number,
    },
    payback7Year: {
        type: Number,
    },
    payback10Year: {
        type: Number,
    },
    percentPerYear: {
        type: Number,
    },
});

const DataForSaleModel = models.DataForSale || model('DataForSale', DataForSaleSchema);

export default DataForSaleModel;