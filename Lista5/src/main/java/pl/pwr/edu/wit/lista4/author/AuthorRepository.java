package pl.pwr.edu.wit.lista4.author;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public class AuthorRepository {

    private final List<Author> authorRepo = new ArrayList<>();
    private int idCounter = 15;

    public AuthorRepository() {
        authorRepo.add(new Author(1, "Henryk", "Sienkiewicz"));
        authorRepo.add(new Author(2, "Stanisław", "Reymont"));
        authorRepo.add(new Author(3, "Adam", "Mickiewicz"));
        authorRepo.add(new Author(4, "Bolesław", "Prus"));
        authorRepo.add(new Author(5, "Wisława", "Szymborska"));
        authorRepo.add(new Author(6, "Juliusz", "Słowacki"));
        authorRepo.add(new Author(7, "Stefan", "Żeromski"));
        authorRepo.add(new Author(8, "Czesław", "Miłosz"));
        authorRepo.add(new Author(9, "Zbigniew", "Herbert"));
        authorRepo.add(new Author(10, "Olga", "Tokarczuk"));
        authorRepo.add(new Author(11, "Witold", "Gombrowicz"));
        authorRepo.add(new Author(12, "Stanisław", "Lem"));
        authorRepo.add(new Author(13, "Andrzej", "Sapkowski"));
        authorRepo.add(new Author(14, "Zofia", "Nałkowska"));
        authorRepo.add(new Author(15, "Maria", "Konopnicka"));
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
        if (author.getId() == 0) {
            idCounter+=1;
            author.setId(idCounter);
            authorRepo.add(author);
            return author;
        } else {
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
    }

    public boolean deleteById(int id) {
        return authorRepo.removeIf(a -> a.getId() == id);
    }
}