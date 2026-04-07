package pl.pwr.edu.wit.lista4.book;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Books Controller", description = "Zarządzanie książkami")
public class BooksControler {
    @Autowired
    IBookService bookService;

    @Operation(summary = "Pobierz wszystkie książki", description = "Zwraca listę wszystkich książek")
    @RequestMapping(value= "/get/books", method = RequestMethod.GET)
    public ResponseEntity<Object> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (size <= 0) size = 10;
        if (page < 0) page = 0;
        java.util.List<Book> allBooks = new java.util.ArrayList<>(bookService.getBooks());
        int start = Math.min(page * size, allBooks.size());
        int end = Math.min((page + 1) * size, allBooks.size());
        
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", allBooks.subList(start, end));
        response.put("currentPage", page);
        response.put("totalItems", allBooks.size());
        response.put("totalPages", (int) Math.ceil((double) allBooks.size() / size));
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Operation(summary = "Pobierz książkę po ID", description = "Zwraca książkę o podanym ID")
    @RequestMapping(value="/get/book/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getBook(@PathVariable("id") int id){
        Book book = bookService.getBook(id);
        if (book != null) {
            return new ResponseEntity<>(book, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Dodaj książkę", description = "Tworzy nową książkę")
    @RequestMapping(value="/post/book", method = RequestMethod.POST)
    public ResponseEntity<Object> createBook(@RequestBody BookDTO bookDTO) {
        Book savedBook = bookService.saveBook(bookDTO);
        if (savedBook == null) {
            return new ResponseEntity<>("Wskazany autor (authorId) nie istnieje.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(savedBook, HttpStatus.OK);
    }

    @Operation(summary = "Aktualizuj książkę", description = "Aktualizuje istniejącą książkę")
    @RequestMapping(value="/put/book/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateBook(@PathVariable("id") int id, @RequestBody BookDTO bookDTO) {
        Book savedBook = bookService.updateBook(id, bookDTO);
        if (savedBook == null) {
            return new ResponseEntity<>("Wskazany autor (authorId) nie istnieje.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(savedBook, HttpStatus.OK);
    }

    @Operation(summary = "Usuń książkę", description = "Usuwa książkę o podanym ID")
    @RequestMapping(value="/delete/book/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteBook(@PathVariable("id") int id) {
        boolean isDeleted = bookService.deleteBook(id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
