import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    const allowedOrigins = [process.env.FRONTEDN_URL];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`)); // Rechazar
    }
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // needed for cookies
};
