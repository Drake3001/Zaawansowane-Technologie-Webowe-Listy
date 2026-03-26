package pl.pwr.edu.wit.lista4.rent;

import org.springframework.stereotype.Service;
import java.util.Collection;

@Service
public class RentService implements IRentService {

    private final RentRepository rentRepository;

    public RentService(RentRepository rentRepository) {
        this.rentRepository = rentRepository;
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
    public Rent rentBook(Rent rent) {
        if (rent.getBook() == null) {
            return null;
        }
        
        boolean isCurrentlyRented = rentRepository.findAll().stream()
            .anyMatch(r -> !r.isReturned() && 
                           r.getBook() != null && 
                           r.getBook().getId() == rent.getBook().getId());
                           
        if (isCurrentlyRented) {
            return null; 
        }

        return rentRepository.rentBook(rent);
    }

    @Override
    public Rent updateRent(Rent rent) {
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
