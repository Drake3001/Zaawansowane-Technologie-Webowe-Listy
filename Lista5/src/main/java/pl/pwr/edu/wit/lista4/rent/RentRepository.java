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
        String[] readers = {
            "Jan Kowalski", "Anna Nowak", "Piotr Wiśniewski", "Maria Dąbrowska", "Tomasz Lewandowski",
            "Katarzyna Wójcik", "Michał Kamiński", "Agnieszka Kowalczyk", "Krzysztof Zieliński", "Ewa Szymańska",
            "Wojciech Woźniak", "Krystyna Kozłowska", "Andrzej Majewski", "Krystyna Kwiatkowska", "Janusz Krawczyk"
        };
        
        for (int i = 1; i <= 15; i++) {
            pl.pwr.edu.wit.lista4.book.Book b = bookRepository.findById(i);
            if (b != null) {
                Rent rent = new Rent(idCounter++, b, readers[i - 1]);
                if (i % 2 == 0) {
                    rent.setRentDate(LocalDate.now().minusDays(10 + i));
                    rent.setReturned(true);
                    rent.setReturnDate(LocalDate.now().minusDays(i));
                } else {
                    rent.setRentDate(LocalDate.now().minusDays(i));
                    rent.setReturned(false);
                }
                rents.add(rent);
            }
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
