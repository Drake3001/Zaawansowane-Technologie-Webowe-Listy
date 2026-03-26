package pl.pwr.edu.wit.lista4.book;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import pl.pwr.edu.wit.lista4.rent.IRentService;

@Service
public class BookService implements IBookService {
    
    private final BookRepository bookRepository;
    private final IRentService rentService;

    public BookService(BookRepository bookRepository, IRentService rentService) {
        this.bookRepository = bookRepository;
        this.rentService = rentService;
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
    public Book saveBook(Book book) {
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
