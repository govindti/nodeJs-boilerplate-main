import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import globalErrorHandler from "./controllers/errorController.js";

const app = express();

// Parse incoming request data as JSON
app.use(express.json());

// CORS
app.use(cors(""));

// Set security HTTP headers
app.use(helmet());

// Log requests to the console in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 req per windowMs
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["price", "category", "rating", "sort", "page", "limit"],
  })
);

// Root Route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Welcome to the API! 🎉" });
});

// API
app.get("/api", (req, res) => {
  res.status(200).json({ status: "success", message: "Api works👍✅✅" });
});

// HANDLE UNDEFINED ERRORS
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
