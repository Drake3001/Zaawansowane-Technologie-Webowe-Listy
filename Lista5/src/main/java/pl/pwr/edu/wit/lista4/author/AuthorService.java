package pl.pwr.edu.wit.lista4.author;

import org.springframework.stereotype.Service;
import java.util.Collection;

import pl.pwr.edu.wit.lista4.book.IBookService;

@Service 
public class AuthorService implements IAuthorService {

    private final AuthorRepository authorRepository;
    private final IBookService bookService;

    public AuthorService(AuthorRepository authorRepository, IBookService bookService) {
        this.authorRepository = authorRepository;
        this.bookService = bookService;
    }

    @Override
    public Collection<Author> getAuthors() {
        return authorRepository.findAll();
    }

    @Override
    public Author getAuthor(int id) {
        return authorRepository.findById(id);
    }

    @Override
    public Author saveAuthor(AuthorDTO authorDto) {
        Author author = new Author();
        author.setName(authorDto.getName());
        author.setSurname(authorDto.getSurname());
        return authorRepository.save(author);
    }

    @Override
    public Author updateAuthor(int id, AuthorDTO authorDto) {
        Author author = new Author();
        author.setId(id);
        author.setName(authorDto.getName());
        author.setSurname(authorDto.getSurname());
        return authorRepository.save(author);
    }

    @Override
    public boolean deleteAuthor(int id) {
        bookService.deleteBooksByAuthorId(id);
        return authorRepository.deleteById(id);
    }
}