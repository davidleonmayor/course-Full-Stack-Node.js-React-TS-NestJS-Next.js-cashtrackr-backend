import { checkSchema, validationResult, Schema } from "express-validator";
import type { Request, Response, NextFunction, RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      budgetId?: number;
    }
  }
}

export const validateResource = (schema: Schema): RequestHandler[] => [
  ...checkSchema(schema),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  },
];
