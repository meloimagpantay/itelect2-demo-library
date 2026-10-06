// controllers/bookController.js -- new in Session 11.
// Every function below was a route handler inside routes/index.js in
// Session 10. Nothing about what they do has changed.
import db from "../models/index.cjs";

const { Book, Author, Sequelize } = db;
const { Op } = Sequelize;

// Session 10: the only columns a request is allowed to set.
// id, createdAt and updatedAt are the database's business.
const BOOK_FIELDS = [
  "title", "publishedDate", "available", "authorId",
];

// GET /api/books and GET /api/books?search=noli
export async function listBooks(req, res) {
  const { search } = req.query;
  const where = {};
  if (search) {
    // Sequelize sends search as a VALUE, never as SQL
    where.title = { [Op.iLike]: `%${search}%` };
  }
  const books = await Book.findAll({
    where,
    include: Author,
    order: [["id", "ASC"]],
  });
  res.json(books);
}

// GET /api/books/:id
export async function getBook(req, res) {
  const book = await Book.findByPk(req.params.id, { include: Author });
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
}

// POST /api/books
export async function createBook(req, res) {
  const book = await Book.create(req.body, { fields: BOOK_FIELDS });
  res.status(201).json(book);
}

// PUT /api/books/:id
export async function updateBook(req, res) {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  await book.update(req.body, { fields: BOOK_FIELDS });
  res.json(book);
}

// DELETE /api/books/:id
export async function deleteBook(req, res) {
  const book = await Book.findByPk(req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  await book.destroy();
  res.json({ message: "Deleted", book, deletedBy: req.user.email });
}
