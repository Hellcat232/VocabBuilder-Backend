import { model, Schema } from 'mongoose';

const answersSchema = new Schema(
  {
    tasksId: { type: String, required: true },
    en: { type: String, required: true },
    ua: { type: String, required: true },
    task: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const AnswersCollection = model('answer', answersSchema);
