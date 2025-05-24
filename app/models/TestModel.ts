import { model, models, Schema } from 'mongoose';

const TestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestModel = models.Test || model('Test', TestSchema);

export default TestModel;
