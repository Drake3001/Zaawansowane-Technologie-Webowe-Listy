# Raport realizacji - Lista 4 (Bootstrap 5 + MDB5)

## Zakres wykonanych prac

W folderze `Lista4` przygotowano kompletny szablon SPA oparty o:
- Bootstrap 5 i komponenty Material Design z `MDB5-STANDARD-UI-KIT-Free-9.3.0`,
- własne style w `style.css`,
- skrypty interaktywne w `script.js`.

Główny plik strony to `index.html`.

## Sekcje wymagane w zadaniu

1. **Sekcja z formularzem kontaktowym**  
   Zrealizowana jako sekcja `#contact` z polami:
   - imię i nazwisko,
   - email,
   - telefon,
   - kierunek podróży (select),
   - wiadomość (textarea),
   - przycisk wysyłki.
   
   Formularz używa komponentów MDB (`form-outline`, ripple), a walidacja działa po stronie klienta (`checkValidity()` w `script.js`).
   Dodatkowo wymagane pola **telefon** i **kierunek** mają `required`, a brak wyboru powoduje stan `invalid` (czerwone obramowanie) i komunikat `.invalid-feedback`.

2. **Sekcja z Google Maps**  
   Zrealizowana jako sekcja `#map` z osadzonym `iframe` Google Maps i kontenerem `.ratio.ratio-16x9`, aby zachować poprawne proporcje responsywne.

3. **Sekcja z tekstem i zdjęciem w stosunku 1:3**  
   Zrealizowana w sekcji `#about` przy pomocy grida:
   - `col-lg-3` (tekst),
   - `col-lg-9` (zdjęcie).  
   Na urządzeniach mobilnych układ przechodzi automatycznie do jednej kolumny.

4. **Sekcja z cytatem**  
   Zrealizowana jako `#quote` z semantycznym znacznikiem `figure > blockquote > figcaption`.

5. **Lista pracowników z Multi-item carousel**  
   Sekcja `#employees` zawiera karuzelę `#employeesCarousel` z **trzema** slajdami, gdzie każdy slajd ma **3 karty pracowników** (`Cards`).  
   Dzięki temu uzyskano efekt multi-item carousel bez użycia komponentu premium.

6. **Sekcja z kontrolką Carousel**  
   Zrealizowana i jednocześnie połączona z kartami pracowników (wariant "na wyższą ocenę"):
   - przyciski `prev/next`,
   - przewijanie myszką (drag) dzięki obsłudze pointer events,
   - płynne przejścia slajdów,
   - karty jako zawartość slajdów.
   
   Autoplay jest wyłączony (slajdy zmieniają się tylko po interakcji).

7. **Sekcja FAQ z Accordion**  
   Sekcja `#faq` zawiera `accordion` z trzema pytaniami i odpowiedziami, oparty o komponent MDB collapse/accordion.

8. **Sekcja z wykresem najpopularniejszych kierunków podróży**  
   Sekcja `#destinations-chart` zawiera `canvas` i wykres słupkowy generowany przez Chart.js:
   - etykiety: Włochy, Hiszpania, Japonia, Islandia, Portugalia, Grecja,
   - dane rezerwacji dla 2026,
   - responsywna konfiguracja osi,
   - powiększony obszar wykresu (`.chart-wrap`) oraz dopracowane style osi/siatki,
   - animacja startowa z easingiem.

9. **Animacje (poziom najwyższej oceny)**  
   Dodano animacje i mikrointerakcje:
   - **reveal on scroll** (`.animate-on-scroll` + `IntersectionObserver`),
   - **parallax** tła w hero (`#intro`) przy przewijaniu (JS na `requestAnimationFrame`),
   - **karty pracowników**: 3D tilt + gradientowy highlight pod kursorem (`.tilt-card` + `.card-glow`),
   - **przycisk CTA**: magnet + przesuwająca się ikona (`.btn-magnet`),
   - **animowane liczniki** w sekcji `#stats` (start po wejściu w viewport).

10. **Sekcja z licznikami (dodatkowa)**  
   Sekcja `#stats` prezentuje animowane wartości: Rezerwacje, Klienci, Kraje w ofercie.

## Zastosowane technologie i biblioteki

- **MDB5 UMD**: `MDB5-STANDARD-UI-KIT-Free-9.3.0/js/mdb.umd.min.js` (lokalnie w `Lista4/`)
- **MDB5 CSS**: `MDB5-STANDARD-UI-KIT-Free-9.3.0/css/mdb.min.css` (lokalnie w `Lista4/`)
- **Font Awesome** (CDN)
- **Google Fonts (Roboto)** (CDN)
- **Chart.js** (CDN)

## Struktura plików w `Lista4`

- `index.html` - pełna struktura SPA i sekcje zadaniowe
- `style.css` - dodatkowe style, wygląd hero, cytatu, kart, wykresu i animacji
- `script.js` - wykres (Chart.js), animacje (scroll/parallax), mikrointerakcje (tilt/magnet), liczniki, walidacja formularza
- `raport.md` - niniejszy raport

## Uwagi do wymagania o Multi-item carousel

W opisie zadania zaznaczono, że kontrolka Multi-item carousel jest wycofana i może wymagać płatnej licencji.  
Dlatego zastosowano podejście zgodne z darmowym zakresem MDB/Bootstrap:
- standardowy `carousel`,
- wewnątrz każdego slajdu układ `row` + 3 kolumny kart (`cards`),
- zachowanie funkcjonalnie odpowiadające multi-item carousel.

## Spełnienie kryteriów

Wszystkie wymagane sekcje zostały zaimplementowane.  
Dodatkowo wykonano wariant "na wyższą ocenę" przez połączenie karuzeli z kartami pracowników oraz dodano animacje wejścia i hover.
