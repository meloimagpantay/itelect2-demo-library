// server.js -- Session 12: the same file, ready to run on a server
// that is not your laptop.
import express from "express";
import cors from "cors";
import morgan from "morgan";
import db from "./models/index.cjs";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import authorRoutes from "./routes/authors.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
// Render sets PORT itself. 3000 is the fallback for your laptop.
const PORT = process.env.PORT || 3000;

// Session 9: without a secret, jwt.sign() throws on the first login.
// Session 10: a short secret can be guessed, so refuse that too.
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters.");
  process.exit(1);
}

// Session 12: refuse to start when the database cannot be reached.
try {
  await db.sequelize.authenticate();
} catch (err) {
  console.error("Cannot reach the database:", err.message);
  process.exit(1);
}

// Session 12: only web pages served from these addresses may read
// the API's answers in a browser. A comma-separated list.
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

// Last, and after every route: Express only reaches it when something threw.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Library API running on port ${PORT}`);
});
