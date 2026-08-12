import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { createApp } from "../app";

vi.mock(
  "@clerk/express",
  async () => (await import("./clerkMock")).clerkModuleMock,
);

const app = createApp();

describe("GET /healthz", () => {
  it("reports ok when mongo is connected", async () => {
    const res = await request(app).get("/healthz");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.db).toBe("connected");
    expect(typeof res.body.uptime).toBe("number");
  });
});

describe("unknown routes", () => {
  it("returns a shaped 404", async () => {
    const res = await request(app).get("/api/nope");

    expect(res.status).toBe(404);
    expect(res.body.error.message).toContain("Route not found");
  });
});
