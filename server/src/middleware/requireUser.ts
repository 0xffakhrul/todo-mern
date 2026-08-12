import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

export function requireUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: { message: "Unauthorized" } });
    return;
  }
  next();
}

export function userIdOf(req: Request<any, any, any, any, any>): string {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new Error("requireUser middleware is missing on this route");
  }
  return userId;
}
