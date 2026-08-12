import { isValidObjectId } from "mongoose";
import { z } from "zod";

const objectId = z
  .string()
  .refine((v) => isValidObjectId(v), { message: "Invalid id format" });

export const createTodoBody = z
  .object({
    description: z.string().trim().min(1).max(500),
  })
  .strict();

export const updateTodoBody = z
  .object({
    description: z.string().trim().min(1).max(500).optional(),
    isCompleted: z.boolean().optional(),
  })
  .strict()
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide description or isCompleted",
  });

export const todoIdParams = z.object({ id: objectId });

export type CreateTodoBody = z.infer<typeof createTodoBody>;
export type UpdateTodoBody = z.infer<typeof updateTodoBody>;
export type TodoIdParams = z.infer<typeof todoIdParams>;
