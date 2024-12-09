import { Schema, model } from 'mongoose';

const tasksSchema = new Schema(
  {
    ua: { type: String, required: true },
    task: { type: String, required: true },
    wordId: { type: Schema.Types.ObjectId, ref: 'public-word', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true, versionKey: false },
);

export const TasksCollection = model('task', tasksSchema);
