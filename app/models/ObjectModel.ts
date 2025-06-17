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
    default: null,
  },
  recordId: {
    type: String,
    ref: 'Record',
    default: null,
  },
  dataForSale: {
    type: String,
    ref: 'DataForSale',
    default: null,
  },
  users: {
    type: [{ type: String }],
    default: [],
  },
});

const ObjectModel = models.Object || model('Object', ObjectSchema);

export default ObjectModel;
