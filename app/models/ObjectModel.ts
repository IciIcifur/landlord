import { model, models, Schema } from 'mongoose';

const ObjectSchema = new Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true, 
    },
    name: { 
        type: String, 
        required: true,
    },
    size: { 
        type: Number,
        min: [0, 'Площадь не может быть отрицательной'], 
        required: true, 
    },
    description: { 
        type: String, 
    },
    recordId: {
        type: String,
        required: true,
        ref: 'Record',
    },
    dataForSale: {
        type: String,
        required: true,
        ref: 'DataForSale',
    },
});

const ObjectModel = models.Object || model('Object', ObjectSchema);

export default ObjectModel;