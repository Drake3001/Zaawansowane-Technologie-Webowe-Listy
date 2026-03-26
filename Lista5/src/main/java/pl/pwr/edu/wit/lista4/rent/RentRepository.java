package pl.pwr.edu.wit.lista4.rent;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public class RentRepository {
    private final List<Rent> rents = new ArrayList<>();
    private int idCounter = 1;

    public RentRepository(pl.pwr.edu.wit.lista4.book.BookRepository bookRepository) {
        pl.pwr.edu.wit.lista4.book.Book b1 = bookRepository.findById(1);
        pl.pwr.edu.wit.lista4.book.Book b2 = bookRepository.findById(2);

        if (b1 != null) {
            Rent rent1 = new Rent(idCounter++, b1, "Jan Kowalski");
            rent1.setRentDate(LocalDate.now().minusDays(10));
            rent1.setReturned(true);
            rent1.setReturnDate(LocalDate.now().minusDays(2));
            rents.add(rent1);
        }

        if (b2 != null) {
            Rent rent2 = new Rent(idCounter++, b2, "Anna Nowak");
            rent2.setRentDate(LocalDate.now().minusDays(5));
            rent2.setReturned(false);
            rents.add(rent2);
        }
    }

    public Collection<Rent> findAll() {
        return rents;
    }

    public Rent findById(int id) {
        return rents.stream()
            .filter(r -> r.getId() == id)
            .findAny()
            .orElse(null);
    }

    public Rent rentBook(Rent rent) {
        rent.setId(idCounter++);
        rent.setRentDate(LocalDate.now());
        rent.setReturned(false);
        rents.add(rent);
        return rent;
    }

    public Rent updateRent(Rent rent) {
        Optional<Rent> existingRent = rents.stream()
            .filter(r -> r.getId() == rent.getId())
            .findFirst();
        
        if (existingRent.isPresent()) {
            Rent r = existingRent.get();
            r.setBook(rent.getBook());
            r.setReaderName(rent.getReaderName());
            r.setRentDate(rent.getRentDate());
            r.setReturnDate(rent.getReturnDate());
            r.setReturned(rent.isReturned());
            return r;
        } else {
            rents.add(rent);
            return rent;
        }
    }

    public Rent returnBook(int id) {
        Rent rent = findById(id);
        if (rent != null && !rent.isReturned()) {
            rent.setReturned(true);
            rent.setReturnDate(LocalDate.now());
        }
        return rent;
    }
    
    public boolean deleteById(int id) {
        return rents.removeIf(r -> r.getId() == id);
    }

    public void deleteByBookId(int bookId) {
        rents.removeIf(r -> r.getBook() != null && r.getBook().getId() == bookId);
    }
}
