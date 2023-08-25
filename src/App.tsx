import { useState } from "react";
import BookSelector from "./components/BookSelector";
import ChapterSelector from "./components/ChapterSelector";
import Toolbar from "./components/Toolbar";

import bookArrayJson from "./data/books.json";
import Book from "./type/Book";

function App() {
  const books = bookArrayJson.map((bookJson) => Book.plainToClass(bookJson));
  const [book, setBook] = useState(books[0]);

  return (
    <>
      <Toolbar />
      <BookSelector books={books} setBook={setBook} />
      <ChapterSelector book={book} />
    </>
  );
}

export default App;
