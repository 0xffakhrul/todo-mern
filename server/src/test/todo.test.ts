import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../app";
import { TodoModel } from "../models/todo.model";

const app = createApp();
const VALID_ID = "6a75fb31f8dba5a73e4c5e3b";

async function seed(userId: string, description: string) {
  return TodoModel.create({ userId, description });
}

describe("POST /api/todos", () => {
  it("creates a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ userId: "me", description: "write tests" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: "me",
      description: "write tests",
      isCompleted: false,
    });
    expect(res.body._id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("rejects unknown keys", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ userId: "me", description: "x", isCompleted: true });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation failed");
    expect(res.body.error.issues[0].message).toContain("isCompleted");
  });

  it("rejects a missing description", async () => {
    const res = await request(app).post("/api/todos").send({ userId: "me" });

    expect(res.status).toBe(400);
    expect(res.body.error.issues).toHaveLength(1);
    expect(res.body.error.issues[0].path).toBe("description");
  });

  it("rejects an empty description after trimming", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ userId: "me", description: "   " });

    expect(res.status).toBe(400);
  });

  it("trims whitespace on success", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ userId: "me", description: "  padded  " });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe("padded");
  });
});

describe("GET /api/todos", () => {
  beforeEach(async () => {
    await seed("alice", "alice one");
    await seed("alice", "alice two");
    await seed("bob", "bob one");
  });

  it("returns every todo from /all", async () => {
    const res = await request(app).get("/api/todos/all");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it("filters by userId", async () => {
    const res = await request(app).get("/api/todos/alice");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((t: { userId: string }) => t.userId === "alice")).toBe(
      true,
    );
  });

  it("returns an empty array for an unknown user", async () => {
    const res = await request(app).get("/api/todos/nobody");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("PUT /api/todos/:id", () => {
  it("updates isCompleted", async () => {
    const todo = await seed("me", "toggle me");

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ isCompleted: true });

    expect(res.status).toBe(200);
    expect(res.body.isCompleted).toBe(true);
  });

  it("rejects an empty body", async () => {
    const todo = await seed("me", "x");

    const res = await request(app).put(`/api/todos/${todo._id}`).send({});

    expect(res.status).toBe(400);
    expect(res.body.error.issues[0].message).toContain("Provide description");
  });

  it("rejects a malformed id", async () => {
    const res = await request(app)
      .put("/api/todos/garbage-id")
      .send({ isCompleted: true });

    expect(res.status).toBe(400);
    expect(res.body.error.issues[0].path).toBe("id");
  });

  it("404s on a valid but missing id", async () => {
    const res = await request(app)
      .put(`/api/todos/${VALID_ID}`)
      .send({ isCompleted: true });

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe("Todo not found");
  });
});

describe("DELETE /api/todos/:id", () => {
  it("deletes and returns the todo", async () => {
    const todo = await seed("me", "delete me");

    const res = await request(app).delete(`/api/todos/${todo._id}`);

    expect(res.status).toBe(200);
    expect(await TodoModel.countDocuments()).toBe(0);
  });

  it("404s on a valid but missing id", async () => {
    const res = await request(app).delete(`/api/todos/${VALID_ID}`);

    expect(res.status).toBe(404);
  });
});