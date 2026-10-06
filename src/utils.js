// Session 3: the library's data and its ES6+ helper functions

export const books = [
  { id: 1, title: "Noli Me Tangere", author: "Jose Rizal", available: true },
  { id: 2, title: "Florante at Laura", author: "Francisco Balagtas", available: true },
  { id: 3, title: "Ibong Adarna", author: "Anonymous", available: false },
];

// template literal
export const formatShelfLabel = ({ title, author }) => `${title} -- ${author}`;

// object destructuring with a default, so validateBook() does not crash
export const validateBook = ({ title, author } = {}) => Boolean(title && author);

// rest operator collects the updates; spread lets later ones win
export const mergeBookUpdate = (original, ...updates) =>
  updates.reduce((merged, update) => ({ ...merged, ...update }), original);

// Session 4: custom error class, thrown when book data does not validate
export class BookValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "BookValidationError";
  }
}

// Session 4: builds a book, but only if validateBook() approves the data
export const createBook = (bookData) => {
  if (!validateBook(bookData)) {
    throw new BookValidationError("Invalid book data");
  }
  return { available: true, ...bookData };
};
