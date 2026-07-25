import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.code === "P2002") {
    res.status(409).json({ error: "Resource already exists" });
    return;
  }

  if (err.code === "P2025") {
    res.status(404).json({ error: "Resource not found" });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
};
