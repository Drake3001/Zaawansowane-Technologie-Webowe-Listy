package pl.pwr.edu.wit.lista4.book;

import org.springframework.stereotype.Repository;

import pl.pwr.edu.wit.lista4.author.Author;
import pl.pwr.edu.wit.lista4.author.AuthorRepository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public class BookRepository {

    private final List<Book> booksRepo = new ArrayList<>();

    public BookRepository(AuthorRepository authorRepository) {
        Author a1 = authorRepository.findById(1);
        Author a2 = authorRepository.findById(2);
        Author a3 = authorRepository.findById(3);
        booksRepo.add(new Book(1, "Potop", a1, 936));
        booksRepo.add(new Book(2, "Wesele", a2, 150));
        booksRepo.add(new Book(3, "Dziady", a3, 292));
    }

    public Collection<Book> findAll() {
        return booksRepo;
    }

    public Book findById(int id) {
        return booksRepo.stream()
            .filter(b -> b.getId() == id)
            .findAny()
            .orElse(null);
    }

    public Book save(Book book) {
        Optional<Book> existingBook = booksRepo.stream()
            .filter(b -> b.getId() == book.getId())
            .findFirst();
        
        if (existingBook.isPresent()) {
            Book b = existingBook.get();
            b.setTitle(book.getTitle());
            b.setAuthor(book.getAuthor());
            b.setPages(book.getPages());
            return b;
        } else {
            booksRepo.add(book);
            return book;
        }
    }

    public boolean deleteById(int id) {
        return booksRepo.removeIf(b -> b.getId() == id);
    }
}
