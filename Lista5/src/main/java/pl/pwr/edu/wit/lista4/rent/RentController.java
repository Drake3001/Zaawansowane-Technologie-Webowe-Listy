package pl.pwr.edu.wit.lista4.rent;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@Tag(name = "Rent Controller", description = "Zarządzanie wypożyczeniami książek")
public class RentController {

    private final IRentService rentService;

    public RentController(IRentService rentService) {
        this.rentService = rentService;
    }

    @Operation(summary = "Pobierz wszystkie wypożyczenia", description = "Zwraca listę wszystkich wypożyczeń")
    @RequestMapping(value = "/get/rents", method = RequestMethod.GET)
    public ResponseEntity<Object> getRents() {
        return new ResponseEntity<>(rentService.getRents(), HttpStatus.OK);
    }

    @Operation(summary = "Pobierz wypożyczenie po ID", description = "Zwraca wypożyczenie o podanym ID")
    @RequestMapping(value = "/get/rent/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> getRent(@PathVariable("id") int id) {
        Rent rent = rentService.getRent(id);
        if (rent != null) {
            return new ResponseEntity<>(rent, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Wypożycz książkę", description = "Tworzy nowe wypożyczenie książki przez czytelnika")
    @RequestMapping(value = "/post/rent", method = RequestMethod.POST)
    public ResponseEntity<Object> rentBook(@RequestBody Rent rent) {
        Rent savedRent = rentService.rentBook(rent);
        if (savedRent == null) {
            return new ResponseEntity<>("Książka jest obecnie wypożyczona", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(savedRent, HttpStatus.OK);
    }

    @Operation(summary = "Aktualizuj wypożyczenie", description = "Aktualizuje dane wypożyczenia")
    @RequestMapping(value = "/put/rent/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateRent(@PathVariable("id") int id, @RequestBody Rent rent) {
        rent.setId(id);
        Rent updatedRent = rentService.updateRent(rent);
        return new ResponseEntity<>(updatedRent, HttpStatus.OK);
    }

    @Operation(summary = "Zwróć książkę", description = "Zaznacza wypożyczenie jako zwrócone")
    @RequestMapping(value = "/put/rent/return/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> returnBook(@PathVariable("id") int id) {
        Rent returnedRent = rentService.returnBook(id);
        if (returnedRent != null) {
            return new ResponseEntity<>(returnedRent, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Operation(summary = "Usuń wypożyczenie", description = "Usuwa wpis o wypożyczeniu o podanym ID")
    @RequestMapping(value = "/delete/rent/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteRent(@PathVariable("id") int id) {
        boolean isDeleted = rentService.deleteRent(id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
