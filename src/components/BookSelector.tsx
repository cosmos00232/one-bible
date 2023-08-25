import styled from "styled-components";

import Book from "../type/Book";

const BookSelectContainer = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #dadce0;
`;

const BookSelect = styled.select`
  padding: 0.5rem;
`;

function BookSelector({
  books,
  setBook,
}: {
  books: Book[];
  setBook: React.Dispatch<React.SetStateAction<Book>>;
}) {
  const handleBookChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBookId = event.target.value;
    const selectedBook = books.find((book) => book.id === selectedBookId);
    if (selectedBook) {
      setBook(selectedBook);
    }
  };

  return (
    <BookSelectContainer>
      <BookSelect onChange={handleBookChange}>
        {books.map((book: Book) => {
          return (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          );
        })}
      </BookSelect>
    </BookSelectContainer>
  );
}

export default BookSelector;
