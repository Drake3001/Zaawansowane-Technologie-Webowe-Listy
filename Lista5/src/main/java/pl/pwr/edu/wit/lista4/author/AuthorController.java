package pl.pwr.edu.wit.lista4.author;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Author Controller", description = "Zarządzanie autorami")
public class AuthorController {

    private final IAuthorService authorService;

    public AuthorController(IAuthorService authorService) {
        this.authorService = authorService;
    }

    @Operation(summary = "Pobierz wszystkich autorów", description = "Zwraca listę wszystkich autorów")
    @RequestMapping(value = "/get/authors", method = RequestMethod.GET)
    public ResponseEntity<Object> getAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        java.util.List<Author> allAuthors = new java.util.ArrayList<>(authorService.getAuthors());
        int start = Math.min(page * size, allAuthors.size());
        int end = Math.min((page + 1) * size, allAuthors.size());
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", allAuthors.subList(start, end));
        response.put("currentPage", page);
        response.put("totalItems", allAuthors.size());
        response.put("totalPages", (int) Math.ceil((double) allAuthors.size() / size));
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Pobierz autora po ID", description = "Zwraca autora o podanym ID")
    @RequestMapping(value = "/get/author/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getAuthor(@PathVariable("id") int id) {
        Author author = authorService.getAuthor(id);
        if (author != null) {
            return new ResponseEntity<>(author, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Dodaj autora", description = "Tworzy nowego autora")
    @RequestMapping(value = "/post/author", method = RequestMethod.POST)
    public ResponseEntity<Object> createAuthor(@RequestBody AuthorDTO authorDto) {
        Author savedAuthor = authorService.saveAuthor(authorDto);
        return new ResponseEntity<>(savedAuthor, HttpStatus.OK);
    }

    @Operation(summary = "Aktualizuj autora", description = "Aktualizuje istniejącego autora")
    @RequestMapping(value = "/put/author/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateAuthor(@PathVariable("id") int id, @RequestBody AuthorDTO authorDto) {
        Author savedAuthor = authorService.updateAuthor(id, authorDto);
        return new ResponseEntity<>(savedAuthor, HttpStatus.OK);
    }

    @Operation(summary = "Usuń autora", description = "Usuwa autora o podanym ID")
    @RequestMapping(value = "/delete/author/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteAuthor(@PathVariable("id") int id) {
        boolean isDeleted = authorService.deleteAuthor(id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
