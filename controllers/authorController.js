// controllers/authorController.js -- new in Session 11.
// One function, moved out of routes/index.js. Authors are a second
// resource, so they get a second controller rather than a second
// function inside bookController.js.
import db from "../models/index.cjs";

const { Author, Book } = db;

// GET /api/authors
export async function listAuthors(req, res) {
  const authors = await Author.findAll({
    include: Book,
    order: [["id", "ASC"]],
  });
  res.json(authors);
}
