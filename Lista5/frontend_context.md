# Kontekst Projektu dla Frontendu (Biblioteka)

Ten dokument zawiera zarys API backendowego (Spring Boot) do zarządzania prostym systemem bibliotecznym. Frontend powinien zostać zbudowany w architekturze komunikującej się z poniższymi endpointami REST API.

## 1. Modele danych (Struktury zwracane przez API i wysyłane z Frontendu)

### Author (Autor)
Reprezentuje autora książki.
```typescript
interface Author {
    id: number;
    name: string;
    surname: string;
}
```

### Book (Książka)
Reprezentuje książkę. Zwracana jest przy zapytaniach `GET`. Zauważ, że zawiera pełny obiekt autora jako zagnieżdżenie.
```typescript
interface Book {
    id: number;
    title: string;
    author: Author;
    pages: number;
}
```

### BookDTO (Tworzenie i aktualizacja książki)
Model używany podczas wysyłania zapytań `POST` i `PUT`. Zamiast całego obiektu autora, przyjmuje wyłącznie jego id.
```typescript
interface BookDTO {
    title: string;
    authorId: number;
    pages: number;
}
```

### Rent (Wypożyczenie)
Reprezentuje wypożyczenie książki przez czytelnika. Zwracane przy operacjach `GET`. Zawiera zagnieżdżony obiekt książki.
```typescript
interface Rent {
    id: number;
    book: Book;
    readerName: string;
    rentDate: string; // format YYYY-MM-DD
    returnDate: string | null; // format YYYY-MM-DD
    returned: boolean;
}
```

### RentDTO (Tworzenie i aktualizacja wypożyczenia)
Model używany podczas wysyłania zapytań `POST` i `PUT`. Zamiast całego obiektu książki przyjmuje tylko jej id.
```typescript
interface RentDTO {
    bookId: number;
    readerName: string;
    rentDate?: string; 
    returnDate?: string | null; 
    returned?: boolean;
}
```

### PaginationResponse (Paginowana odpowiedź)
Dla wszystkich operacji grupowych (zwracających lity), API korzysta z paginacji. 
```typescript
interface PaginationResponse<T> {
    content: T[];         // elementy na danej stronie
    currentPage: number;  // obecna strona (0-indeksowana)
    totalItems: number;   // całkowita liczba elementów w bazie
    totalPages: number;   // całkowita liczba stron dla podanego 'size'
}
```

---

## 2. API Endpoints

Wszystkie endpointy grupują operacje dla autorów, książek i wypożyczeń.

### Autorzy (Author Controller)
* **Pobranie wszystkich (z paginacją)**
  * `GET /get/authors?page={page}&size={size}` (domyślnie `page=0`, `size=10`)
  * Odpowiedź: `PaginationResponse<Author>`
* **Pobranie po ID**
  * `GET /get/author/{id}`
  * Odpowiedź: `Author` lub `404 Not Found`
* **Nowy autor**
  * `POST /post/author`
  * Body: `Author` (bez id, lub zostanie nadpisane przez serwer)
  * Odpowiedź: Zapisany `Author`
* **Aktualizacja**
  * `PUT /put/author/{id}`
  * Body: `Author`
  * Odpowiedź: Zaktualizowany `Author`
* **Usunięcie**
  * `DELETE /delete/author/{id}`
  * Odpowiedź: `200 OK` lub `404 Not Found`

### Książki (Books Controller)
* **Pobranie wszystkich (z paginacją)**
  * `GET /get/books?page={page}&size={size}` (domyślnie `page=0`, `size=10`)
  * Odpowiedź: `PaginationResponse<Book>`
* **Pobranie po ID**
  * `GET /get/book/{id}`
  * Odpowiedź: `Book` lub `404 Not Found`
* **Nowa książka**
  * `POST /post/book`
  * Body: `BookDTO`
  * Odpowiedź: Zapisany `Book` lub `400 Bad Request` w przypadku powołania się na nieistniejącego autora
* **Aktualizacja**
  * `PUT /put/book/{id}`
  * Body: `BookDTO`
  * Odpowiedź: Zaktualizowany `Book` lub `400 Bad Request` 
* **Usunięcie**
  * `DELETE /delete/book/{id}`
  * Uwaga: Usunięcie książki usuwa także (kaskadowo) wypożyczenia z nią powiązane.
  * Odpowiedź: `200 OK` lub `404 Not Found`

### Wypożyczenia (Rent Controller)
* **Pobranie wszystkich (z paginacją)**
  * `GET /get/rents?page={page}&size={size}` (domyślnie `page=0`, `size=10`)
  * Odpowiedź: `PaginationResponse<Rent>`
* **Pobranie po ID**
  * `GET /get/rent/{id}`
  * Odpowiedź: `Rent` lub `404 Not Found`
* **Wypożyczenie nowej książki**
  * `POST /post/rent`
  * Body: `RentDTO` (wymagane właściwie tylko `bookId` i `readerName`, data zostanie ustalona i flaga zwrotu na postawiona `false` przez serwer)
  * Odpowiedź: Utworzony rekord `Rent` lub `409 Conflict` w przypadku gdy książka jest aktualnie niedostępna. Jeśli podana książka nie istnieje zostanie na ten moment też rzucony konflikt.
* **Aktualizacja całego pojedynczego wypożyczenia**
  * `PUT /put/rent/{id}`
  * Body: `RentDTO`
  * Odpowiedź: Zaktualizowany `Rent` lub błąd
* **Oddanie i zwrócenie książki (szybka akcja)**
  * `PUT /put/rent/return/{id}`
  * Odpowiedź: Zwrócony `Rent` zawierający wypełnione pole `returnDate` oraz `returned` ustawiony na `true`, lub `404 Not Found`.
* **Usuń wpis i trwale skasuj informację z bazy**
  * `DELETE /delete/rent/{id}`
  * Odpowiedź: `200 OK` lub `404 Not Found`

---

## 3. Kluczowe uwarunkowania dla Frontend-u
- Paginacja korzysta z indeksowania `0`, to znaczy że pierwsza strona to zawsze `page=0`. Należy to brać pod uwagę przy budowaniu kontrolek stronnicowania (Tabel / List) w UI.
- API korzysta z in-memory list (symulacji bazy danych), więc wyłączenie i zrestartowanie aplikacji Backendowej przywraca jej dane do wejściowych / deweloperskich. Niektóre operacje kaskadowe mogą wymagać odświeżenia tabel we frontendzie. Oprócz tego na backendzie nie korzystamy stricte z pełnego Spring Data, więc ręczna paginacja polega tam bezpośrednio na podzbiorach (sublist) elementów głównych list. 
- Formularze Dodawania / Edycji dla **Book** i **Rent** we frontendzie zamiast bezpośrednio obiektów (typu np dropdown dla `Author` przekazujący cały obiekt autora) powinny wiązać swoje modele formularza tak, aby wysyłać do operacji POST/PUT pole `authorId` dla książki bądź `bookId` w wypadku wypożyczeń, stąd dedykowanie DTO jako Payload dla tych dróg. Wszędzie zachowano typ prosty jako standard.
