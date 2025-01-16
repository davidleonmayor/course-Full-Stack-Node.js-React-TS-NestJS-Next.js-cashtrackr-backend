import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: {
    error: "You have exceeded the limit of requests",
  },
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & -draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});
