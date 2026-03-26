package pl.pwr.edu.wit.lista4.author;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public class AuthorRepository {

    private final List<Author> authorRepo = new ArrayList<>();

    public AuthorRepository() {
        authorRepo.add(new Author(1, "Henryk", "Sienkiewicz"));
        authorRepo.add(new Author(2, "Stanisław", "Reymont"));
        authorRepo.add(new Author(3, "Adam", "Mickiewicz"));
    }

    public Collection<Author> findAll() {
        return authorRepo;
    }

    public Author findById(int id) {
        return authorRepo.stream()
            .filter(a -> a.getId() == id)
            .findAny()
            .orElse(null);
    }

    public Author save(Author author) {
        Optional<Author> existingAuthor = authorRepo.stream()
            .filter(a -> a.getId() == author.getId())
            .findFirst();
        
        if (existingAuthor.isPresent()) {
            Author a = existingAuthor.get();
            a.setName(author.getName());
            a.setSurname(author.getSurname());
            return a;
        } else {
            authorRepo.add(author);
            return author;
        }
    }

    public boolean deleteById(int id) {
        return authorRepo.removeIf(a -> a.getId() == id);
    }
}