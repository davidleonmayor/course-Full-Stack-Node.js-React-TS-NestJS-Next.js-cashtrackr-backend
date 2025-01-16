import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if bearer token is present
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Unauthorized: Token missing or invalid format" });
    return;
  }

  // the token has the correct format?
  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Token is required" });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_TOKEN);
    // console.log("result", result);
    if (typeof result === "object" && result.id) {
      const user = await User.findByPk(result.id, {
        attributes: { exclude: ["password", "confirmed", "token"] },
      });
      if (!user) {
        res.status(404).json({ error: "User doesn't exist" });
        return;
      }

      req.user = user;
      next();
    } else {
      res
        .status(401)
        .json({ error: "Unauthorized: Invalid token or verification failed" });
      return;
    }
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(500).json({ error: "Invalid token or verification failed" });
  }
};
