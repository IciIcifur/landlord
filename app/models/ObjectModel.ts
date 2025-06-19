import { model, models, Schema } from 'mongoose';

const ObjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  square: {
    type: Number,
    min: [0, 'Площадь не может быть отрицательной'],
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  records: {
    type: [{ type: String }],
    ref: 'Record',
    default: [],
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

ObjectSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

ObjectSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});

const ObjectModel = models.Object || model('Object', ObjectSchema);

export default ObjectModel;
