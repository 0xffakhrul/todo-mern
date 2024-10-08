import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todo from "./routes/todos";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log("listening on 6969"));

const mongoURI: string = process.env.MONGO_URI!;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("CONNECTED!");
  } catch (error) {
    console.log("ERROR!", error);
  }
};

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("YOOOOO");
});

app.use("/api/todos", todo);
