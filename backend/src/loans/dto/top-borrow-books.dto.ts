import { Book } from '../../books/entity/book.entity';

export type TopBorrowBooksDto = {
  id: number;
  book: Book;
};
