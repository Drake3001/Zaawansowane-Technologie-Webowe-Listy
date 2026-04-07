package pl.pwr.edu.wit.lista4.book;

import java.util.Collection;

public interface IBookService {
    Collection<Book> getBooks();
    Book getBook(int id);
    Book saveBook(BookDTO book);
    Book updateBook(int id, BookDTO book);
    boolean deleteBook(int id);
    void deleteBooksByAuthorId(int authorId);
}
