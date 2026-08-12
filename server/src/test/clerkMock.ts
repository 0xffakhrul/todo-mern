import type { NextFunction, Request, Response } from "express";

export const auth: { userId: string | null } = { userId: null };

export const clerkModuleMock = {
  clerkMiddleware:
    () => (_req: Request, _res: Response, next: NextFunction) => {
      next();
    },
  getAuth: () => ({ userId: auth.userId }),
};
