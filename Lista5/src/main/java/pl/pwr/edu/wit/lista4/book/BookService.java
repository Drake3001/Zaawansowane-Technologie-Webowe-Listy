package pl.pwr.edu.wit.lista4.book;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import pl.pwr.edu.wit.lista4.rent.IRentService;
import pl.pwr.edu.wit.lista4.author.AuthorRepository;
import pl.pwr.edu.wit.lista4.author.Author;
@Service
public class BookService implements IBookService {
    
    private final BookRepository bookRepository;
    private final IRentService rentService;
    private final AuthorRepository authorRepository;

    public BookService(BookRepository bookRepository, IRentService rentService, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.rentService = rentService;
        this.authorRepository = authorRepository;
    }

    @Override
    public Collection<Book> getBooks(){
        return bookRepository.findAll();
    }

    @Override
    public Book getBook(int id){
        return bookRepository.findById(id);
    }

    @Override
    public Book saveBook(BookDTO bookDto) {
        Author author = authorRepository.findById(bookDto.getAuthorId());
        if (author == null) {
            return null; // autor nie istnieje
        }
        Book book = new Book();
        book.setTitle(bookDto.getTitle());
        book.setAuthor(author);
        book.setPages(bookDto.getPages());
        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(int id, BookDTO bookDto) {
        Author author = authorRepository.findById(bookDto.getAuthorId());
        if (author == null) {
            return null;
        }
        Book book = new Book();
        book.setId(id);
        book.setTitle(bookDto.getTitle());
        book.setAuthor(author);
        book.setPages(bookDto.getPages());
        return bookRepository.save(book);
    }

    @Override
    public boolean deleteBook(int id) {
        rentService.deleteRentsByBookId(id);
        return bookRepository.deleteById(id);
    }

    @Override
    public void deleteBooksByAuthorId(int authorId) {
        List<Integer> bookIds = bookRepository.findAll().stream()
            .filter(b -> b.getAuthor() != null && b.getAuthor().getId() == authorId)
            .map(Book::getId)
            .toList();
            
        for (int bookId : bookIds) {
            deleteBook(bookId);
        }
    }
}
