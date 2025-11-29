import { NextFunction, Request, Response } from "express";
import { CustomAPIError } from "../errors/custom-error";

export default function errorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  console.error("Internal Server Error:", err);

  return res.status(500).json({ msg: "Something went wrong." });
}
