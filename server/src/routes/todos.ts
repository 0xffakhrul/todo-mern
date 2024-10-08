import express, { Request, Response } from "express";
import { Todo } from "../models/Todo";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();

    res.status(200).send(todos);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const todos = await Todo.find({ userId: userId });

    res.status(200).send(todos);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newTodo = new Todo(data);
    const createdTodo = await newTodo.save();

    res.status(201).send(createdTodo);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const todo = await Todo.findByIdAndUpdate(id, data, { new: true });

    if (!todo) {
      return res.status(404).json("Couldnt find the todo");
    }

    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json("Couldnt find the todo");
    }

    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
