package pl.pwr.edu.wit.lista4.rent;

import pl.pwr.edu.wit.lista4.book.Book;

import java.time.LocalDate;

public class Rent {
    private int id;
    private Book book;
    private String readerName;
    private LocalDate rentDate;
    private LocalDate returnDate;
    private boolean returned;

    public Rent() {
    }

    public Rent(int id, Book book, String readerName) {
        this.id = id;
        this.book = book;
        this.readerName = readerName;
        this.rentDate = LocalDate.now();
        this.returned = false;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public String getReaderName() {
        return readerName;
    }

    public void setReaderName(String readerName) {
        this.readerName = readerName;
    }

    public LocalDate getRentDate() {
        return rentDate;
    }

    public void setRentDate(LocalDate rentDate) {
        this.rentDate = rentDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public boolean isReturned() {
        return returned;
    }

    public void setReturned(boolean returned) {
        this.returned = returned;
    }
}
