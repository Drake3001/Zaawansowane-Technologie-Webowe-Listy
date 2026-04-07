package pl.pwr.edu.wit.lista4.rent;

import java.util.Collection;

public interface IRentService {
    Collection<Rent> getRents();
    Rent getRent(int id);
    Rent rentBook(RentDTO rentDto);
    Rent updateRent(int id, RentDTO rentDto);
    Rent returnBook(int id);
    boolean deleteRent(int id);
    void deleteRentsByBookId(int bookId);
}
