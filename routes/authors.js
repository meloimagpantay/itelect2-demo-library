// routes/authors.js -- new in Session 11. Mounted at /api/authors.
import express from "express";
import { listAuthors } from "../controllers/authorController.js";

const router = express.Router();

router.get("/", listAuthors);

export default router;
