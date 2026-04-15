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
    private int idCounter = 15;

    public BookRepository(AuthorRepository authorRepository) {
        booksRepo.add(new Book(1, "Potop", authorRepository.findById(1), 936));
        booksRepo.add(new Book(2, "Chłopi", authorRepository.findById(2), 800));
        booksRepo.add(new Book(3, "Dziady", authorRepository.findById(3), 292));
        booksRepo.add(new Book(4, "Lalka", authorRepository.findById(4), 680));
        booksRepo.add(new Book(5, "Nic dwa razy", authorRepository.findById(5), 120));
        booksRepo.add(new Book(6, "Kordian", authorRepository.findById(6), 150));
        booksRepo.add(new Book(7, "Przedwiośnie", authorRepository.findById(7), 320));
        booksRepo.add(new Book(8, "Dolina Issy", authorRepository.findById(8), 260));
        booksRepo.add(new Book(9, "Pan Cogito", authorRepository.findById(9), 110));
        booksRepo.add(new Book(10, "Bieguni", authorRepository.findById(10), 460));
        booksRepo.add(new Book(11, "Ferdydurke", authorRepository.findById(11), 300));
        booksRepo.add(new Book(12, "Solaris", authorRepository.findById(12), 250));
        booksRepo.add(new Book(13, "Wiedźmin", authorRepository.findById(13), 320));
        booksRepo.add(new Book(14, "Medaliony", authorRepository.findById(14), 100));
        booksRepo.add(new Book(15, "Rota", authorRepository.findById(15), 50));
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
        if (book.getId() == 0) {
            idCounter+=1;
            book.setId(idCounter);
            booksRepo.add(book);
            return book;
        } else {
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
    }

    public boolean deleteById(int id) {
        return booksRepo.removeIf(b -> b.getId() == id);
    }
}
