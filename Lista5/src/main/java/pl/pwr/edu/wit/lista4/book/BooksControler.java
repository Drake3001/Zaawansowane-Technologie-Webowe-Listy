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
    public ResponseEntity<Object> getBooks() {
        return new ResponseEntity<>(bookService.getBooks(), HttpStatus.OK);
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
    public ResponseEntity<Object> createBook(@RequestBody Book book) {
        Book savedBook = bookService.saveBook(book);
        return new ResponseEntity<>(savedBook, HttpStatus.OK);
    }

    @Operation(summary = "Aktualizuj książkę", description = "Aktualizuje istniejącą książkę")
    @RequestMapping(value="/put/book/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateBook(@PathVariable("id") int id, @RequestBody Book book) {
        book.setId(id);
        Book savedBook = bookService.saveBook(book);
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
