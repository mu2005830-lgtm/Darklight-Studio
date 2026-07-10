import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// Allow requests from the configured frontend origin (set ALLOWED_ORIGIN in production)
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use(
  cors({
    origin: allowedOrigin
      ? [allowedOrigin, /\.vercel\.app$/, /localhost/]
      : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seed images now live in /public/api-assets and are served directly by
// Vercel's static hosting — no Express static mount needed here.
app.use("/api", router);

// Centralized error handler — catches any unhandled errors thrown from route
// handlers (including DB errors, Zod parse failures passed via next(err), etc.)
// and returns a consistent JSON shape instead of leaking stack traces.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred.";
  logger.error({ err }, "Unhandled route error");
  res.status(500).json({ error: message });
});

export default app;
