package pl.pwr.edu.wit.lista4.author;

import java.util.Collection;

public interface IAuthorService {
    Collection<Author> getAuthors();
    Author getAuthor(int id);
    Author saveAuthor(Author author);
    boolean deleteAuthor(int id);
}