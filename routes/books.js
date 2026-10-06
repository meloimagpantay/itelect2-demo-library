// routes/books.js -- new in Session 11. Wiring only: which URL runs
// which controller function, and which guards run first.
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import requireRole from "../middleware/requireRole.js";
import {
  listBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

const router = express.Router();

// server.js mounts this router at /api/books, so "/" is /api/books
router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", verifyToken, createBook);
router.put("/:id", verifyToken, updateBook);
router.delete("/:id", verifyToken, requireRole("admin"), deleteBook);

export default router;
