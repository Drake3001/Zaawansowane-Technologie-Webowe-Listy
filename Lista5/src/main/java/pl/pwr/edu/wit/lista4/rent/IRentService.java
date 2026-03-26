package pl.pwr.edu.wit.lista4.rent;

import java.util.Collection;

public interface IRentService {
    Collection<Rent> getRents();
    Rent getRent(int id);
    Rent rentBook(Rent rent);
    Rent updateRent(Rent rent);
    Rent returnBook(int id);
    boolean deleteRent(int id);
    void deleteRentsByBookId(int bookId);
}
