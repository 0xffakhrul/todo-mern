import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: () => new Date() },
});

export const Todo = mongoose.model("Todo", todoSchema);
