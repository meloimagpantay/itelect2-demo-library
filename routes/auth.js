// routes/auth.js -- Session 9 wrote the handlers here. Session 11
// keeps the file and takes the handlers out of it.
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { register, login, me } from "../controllers/authController.js";

const router = express.Router();

// mounted at /api/auth in server.js
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);

export default router;
