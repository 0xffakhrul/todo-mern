import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app";
import { TodoModel } from "../models/todo.model";
import { auth } from "./clerkMock";

vi.mock(
  "@clerk/express",
  async () => (await import("./clerkMock")).clerkModuleMock,
);

const app = createApp();
const VALID_ID = "6a75fb31f8dba5a73e4c5e3b";
const ME = "user_me";

async function seed(userId: string, description: string) {
  return TodoModel.create({ userId, description });
}

beforeEach(() => {
  auth.userId = ME;
});

describe("auth", () => {
  it("401s when there is no signed-in user", async () => {
    auth.userId = null;

    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe("Unauthorized");
  });
});

describe("POST /api/todos", () => {
  it("creates a todo owned by the signed-in user", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ description: "write tests" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: ME,
      description: "write tests",
      isCompleted: false,
    });
    expect(res.body._id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("rejects unknown keys", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ description: "x", isCompleted: true });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("Validation failed");
    expect(res.body.error.issues[0].message).toContain("isCompleted");
  });

  it("rejects a client-supplied userId", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ userId: "someone-else", description: "x" });

    expect(res.status).toBe(400);
    expect(res.body.error.issues[0].message).toContain("userId");
  });

  it("rejects a missing description", async () => {
    const res = await request(app).post("/api/todos").send({});

    expect(res.status).toBe(400);
    expect(res.body.error.issues).toHaveLength(1);
    expect(res.body.error.issues[0].path).toBe("description");
  });

  it("rejects an empty description after trimming", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ description: "   " });

    expect(res.status).toBe(400);
  });

  it("trims whitespace on success", async () => {
    const res = await request(app)
      .post("/api/todos")
      .send({ description: "  padded  " });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe("padded");
  });
});

describe("GET /api/todos", () => {
  beforeEach(async () => {
    await seed(ME, "mine one");
    await seed(ME, "mine two");
    await seed("user_bob", "bob one");
  });

  it("returns only the signed-in user's todos", async () => {
    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body.every((t: { userId: string }) => t.userId === ME)).toBe(
      true,
    );
  });

  it("returns an empty array for a user with no todos", async () => {
    auth.userId = "user_nobody";

    const res = await request(app).get("/api/todos");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("PUT /api/todos/:id", () => {
  it("updates isCompleted", async () => {
    const todo = await seed(ME, "toggle me");

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ isCompleted: true });

    expect(res.status).toBe(200);
    expect(res.body.isCompleted).toBe(true);
  });

  it("rejects an empty body", async () => {
    const todo = await seed(ME, "x");

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

  it("404s on another user's todo", async () => {
    const todo = await seed("user_bob", "not yours");

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ isCompleted: true });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/todos/:id", () => {
  it("deletes and returns the todo", async () => {
    const todo = await seed(ME, "delete me");

    const res = await request(app).delete(`/api/todos/${todo._id}`);

    expect(res.status).toBe(200);
    expect(await TodoModel.countDocuments()).toBe(0);
  });

  it("404s on a valid but missing id", async () => {
    const res = await request(app).delete(`/api/todos/${VALID_ID}`);

    expect(res.status).toBe(404);
  });

  it("404s on another user's todo", async () => {
    const todo = await seed("user_bob", "not yours");

    const res = await request(app).delete(`/api/todos/${todo._id}`);

    expect(res.status).toBe(404);
    expect(await TodoModel.countDocuments()).toBe(1);
  });
});
