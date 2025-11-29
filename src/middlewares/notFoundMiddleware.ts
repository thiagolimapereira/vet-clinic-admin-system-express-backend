import { Request, Response } from "express";

export default function notFoundMiddleware(req: Request, res: Response) {
  return res.status(404).json({ error: "Route does not exist." });
}
