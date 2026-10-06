// controllers/authController.js -- new in Session 11.
// The three handlers that were written inside routes/auth.js in
// Sessions 9 and 10. The bodies are unchanged.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.cjs";

const { User } = db;

// How much work one hash costs. 10 means bcrypt runs 2^10 = 1024 rounds.
const SALT_ROUNDS = 10;

// POST /api/auth/register
export async function register(req, res) {
  const { email, password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: "password must be at least 8 characters" });
  }

  const taken = await User.findOne({ where: { email } });
  if (taken) {
    return res.status(409).json({ error: "That email is already registered" });
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  // role is NOT read from req.body. If it were, anyone could register as admin.
  const user = await User.create({ email, password: hash });

  res.status(201).json(user);
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
}

// GET /api/auth/me -- verifyToken runs first, so req.user is already set
export function me(req, res) {
  res.json({ user: req.user });
}
