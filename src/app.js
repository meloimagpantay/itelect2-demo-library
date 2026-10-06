import { books, formatShelfLabel, validateBook, mergeBookUpdate, createBook } from "./utils.js";
import { fetchSampleAuthors } from "./api.js";

console.log("Library API - app.js is running");

// Session 3: try each helper once
console.log(formatShelfLabel(books[0]));
console.log(validateBook({ title: "Mga Ibong Mandaragit", author: "Amado Hernandez" }));
console.log(validateBook());
console.log(mergeBookUpdate(books[2], { available: true }));

// Session 4: async work and error handling
try {
  const authors = await fetchSampleAuthors();
  console.log(`Fetched ${authors.length} authors`);

  const newBook = createBook({ title: "El Filibusterismo", author: "Jose Rizal" });
  console.log("Created book:", newBook);

  createBook({ title: "No Author Here" });   // missing author -> throws
} catch (err) {
  console.error(`${err.name}: ${err.message}`);
}
