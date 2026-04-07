package pl.pwr.edu.wit.lista4.rent;

import org.springframework.stereotype.Service;
import java.util.Collection;
import pl.pwr.edu.wit.lista4.book.BookRepository;
import pl.pwr.edu.wit.lista4.book.Book;

@Service
public class RentService implements IRentService {

    private final RentRepository rentRepository;
    private final BookRepository bookRepository;

    public RentService(RentRepository rentRepository, BookRepository bookRepository) {
        this.rentRepository = rentRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public Collection<Rent> getRents() {
        return rentRepository.findAll();
    }

    @Override
    public Rent getRent(int id) {
        return rentRepository.findById(id);
    }

    @Override
    public Rent rentBook(RentDTO rentDto) {
        Book book = bookRepository.findById(rentDto.getBookId());
        if (book == null) {
            return null;
        }

        boolean isCurrentlyRented = rentRepository.findAll().stream()
            .anyMatch(r -> !r.isReturned() && 
                           r.getBook() != null && 
                           r.getBook().getId() == book.getId());
                           
        if (isCurrentlyRented) {
            return null; 
        }

        Rent rent = new Rent();
        rent.setBook(book);
        rent.setReaderName(rentDto.getReaderName());
        
        return rentRepository.rentBook(rent);
    }

    @Override
    public Rent updateRent(int id, RentDTO rentDto) {
        Book book = bookRepository.findById(rentDto.getBookId());
        if (book == null) {
            return null;
        }
        
        Rent rent = new Rent();
        rent.setId(id);
        rent.setBook(book);
        rent.setReaderName(rentDto.getReaderName());
        rent.setRentDate(rentDto.getRentDate());
        rent.setReturnDate(rentDto.getReturnDate());
        rent.setReturned(rentDto.isReturned());
        
        return rentRepository.updateRent(rent);
    }

    @Override
    public Rent returnBook(int id) {
        return rentRepository.returnBook(id);
    }

    @Override
    public boolean deleteRent(int id) {
        return rentRepository.deleteById(id);
    }

    @Override
    public void deleteRentsByBookId(int bookId) {
        rentRepository.deleteByBookId(bookId);
    }
}
