import {
  type HydratedDocument,
  type InferSchemaType,
  model,
  Schema,
} from "mongoose";

const todoSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type Todo = InferSchemaType<typeof todoSchema>;
export type TodoDocument = HydratedDocument<Todo>;

export const TodoModel = model("Todo", todoSchema);
