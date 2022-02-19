import rateLimit from "express-rate-limit";
import { APPLICATION } from "./config";

interface LimitMessage {
  statusCode: number;
  message: string;
  [key: string]: unknown;
}

export const limiter = rateLimit({
  headers: true,
  max: APPLICATION.MAX_REQUESTS,
  windowMs: APPLICATION.TIME_FRAME,
  skip: ({ path }) => {
    // Don't limit health checks.
    if (path === "/health") return true;
    return false;
  },
  message: {
    statusCode: 429,
    error: "Too Many Requests",
    message: "You are being rate limited.",
  } as unknown as LimitMessage,
});
