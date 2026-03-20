# Raport - Lista3 (wersja uproszczona)

## Co zostalo uproszczone

- Strona zostala przebudowana do 3 prostych sekcji: Hero, Figury, Mini zasady.
- Usunieto rozbudowany header/footer i ciezka, recznie wpisywana szachownice w HTML.
- Struktura SCSS pozostala modularna: `base`, `abstracts`, `components`, `layout`.
- Styl i tresc sa teraz bardziej "zadaniowe", z naciskiem na czytelny pokaz funkcji SASS.

## Gdzie celowo uzyto funkcji SASS

### 1) Karty figur (`scss/components/_cards.scss`)

- **Zmienne:** kolory, spacing, rozmiary fontow (`$text-secondary`, `$spacing-xl`).
- **Zagniezdzenia:** BEM (`.piece-card`, `&__icon`, `&__value`).
- **Dziedziczenie:** `@extend %glass-card` oraz `@extend %badge`.
- **Operatory:** np. `font-size: $font-size-3xl * 1.1`.
- **Mixiny:** `@include flex-center(column)`, `@include gold-hover-glow`, `@include card-grid(...)`.

### 2) Sekcja zasad (`scss/layout/_sections.scss`)

- **Mixiny:** `@include card-grid(...)`, `@include checkerboard-bg(...)`, `@include flex-center(...)`.
- **Dziedziczenie:** `%container`, `%section-header`, `%badge`, `%glass-card`.
- **Operatory:** np. `padding: $spacing-lg * 1.2`, `width: $spacing-xl * 1.4`.
- **Zagniezdzenia:** struktura `rules__card-*` w jednym bloku.

### 3) Hero + CTA (`scss/layout/_hero.scss`, `scss/components/_buttons.scss`)

- **Mixiny:** `section-base`, `checkerboard-bg`, `btn-base`.
- **Zmienne:** gradienty, cienie, kolory i przejscia.
- **Zagniezdzenia:** `btn` z wariantami `&--primary`, `&--ghost`, `&--lg`.
- **Operatory:** np. `gap: $spacing-sm * 2`, `padding: $spacing-md * 1.2 $spacing-2xl`.

## Struktura plikow SCSS po zmianach

- `scss/main.scss` - importy tylko potrzebnych modulow.
- `scss/base/_variables.scss` - centralne wartosci projektu.
- `scss/abstracts/_mixins.scss` - mixiny reuzywalne.
- `scss/abstracts/_placeholders.scss` - placeholdery do `@extend`.
- `scss/components/_buttons.scss` - przyciski i warianty.
- `scss/components/_cards.scss` - karty figur.
- `scss/layout/_hero.scss` - sekcja startowa.
- `scss/layout/_sections.scss` - sekcje i karty zasad.

## Kompilacja

- SCSS skompilowano do `css/main.css` poleceniem:
  - `sass scss/main.scss css/main.css`
- Kompilacja przechodzi poprawnie.
- Pozostaja ostrzezenia deprecacji `@import` (do migracji na `@use` w kolejnym kroku).
# Raport: Funkcjonalności SASS/SCSS w projekcie ChessMaster

Strona zawiera **3 sekcje treści**: Hero (z szachownicą) · Figury · Zasady  
Struktura plików SCSS pozostaje nienaruszona: `abstracts/`, `base/`, `components/`, `layout/`.

---

## 1. Zmienne (`$variable`)

> **Plik:** `scss/base/_variables.scss`

Centralne źródło wszystkich wartości — kolory, fonty, odstępy, wymiary, cienie, breakpointy.

| Zmienna | Wartość | Gdzie użyta |
|---|---|---|
| `$color-gold` | `#e2b04a` | przyciski, obramowania, akcenty złote |
| `$bg-primary` / `$bg-secondary` | `#1a1a2e` / `#16213e` | tło sekcji |
| `$font-heading` / `$font-body` | Playfair Display / Inter | typografia globalna |
| `$font-size-*` (xs → 5xl) | skala od 12px do 80px | nagłówki, opisy, wartości figur |
| `$spacing-*` (xs → 4xl) | 4px → 96px | paddingi, gap, marginesy |
| `$board-size` / `$square-size` | 480px / 60px | szachownica w hero |
| `$radius-*` | 4–9999px | zaokrąglenia kart, odznak, przycisków |
| `$shadow-*` / `$shadow-gold` | box-shadow values | karty, przyciski, szachownica |
| `$gradient-gold` / `$gradient-dark` | gradienty | tła, teksty złote |
| `$bp-sm` … `$bp-xl` | 576–1200px | media queries w mixinie `respond-to` |
| `$transition-base` / `$transition-spring` | easing curves | hover efekty |

**Przykład:**
```scss
// _variables.scss
$color-gold: #e2b04a;
$board-size:  480px;
$square-size: 60px;   // $board-size / 8 (komentarz — operator)

// _buttons.scss
.btn--sm {
  padding: $spacing-xs * 1.5 $spacing-md;
}
```

---

## 2. Zagnieżdżenia (Nesting)

> **Pliki:** wszystkie pliki `layout/` i `components/`

Metodologia **BEM** (`blok__element--modyfikator`) realizowana przez zagnieżdżenia z `&`.

| Selektor | Plik | Opis |
|---|---|---|
| `.chessboard__frame`, `__grid`, `__square`, `__piece` | `_board.scss` | Kompletna szachownica BEM |
| `.chessboard__square--light:hover` | `_board.scss` | Hover na polach szachownicy (3 poziomy) |
| `.chessboard__piece--white/black` | `_board.scss` | Warianty figur |
| `.header__nav`, `__logo`, `__logo-icon`, `__link::after` | `_header.scss` | Navbar BEM, animowany podkreślnik |
| `.header__link:hover::after` | `_header.scss` | 3-poziomowe zagnieżdżenie: link → hover → pseudo |
| `.hero__inner`, `__content`, `__stat-value`, `__board-glow` | `_hero.scss` | Cały layout hero |
| `.piece-card__icon`, `__name`, `__value`, `__move` | `_cards.scss` | Elementy karty figury |
| `.piece-card:hover &` (wewnątrz `__icon`) | `_cards.scss` | Odwrócone zagnieżdżenie BEM |
| `.rules__card-number`, `__card-title`, `__card-icon` | `_sections.scss` | Elementy kart zasad |

**Przykład:**
```scss
// _header.scss
.header {
  &__link {
    &::after {
      width: 0;
      transition: width $transition-base;
    }
    &:hover {
      &::after { width: 100%; }   // ← 3 poziomy zagnieżdżenia
    }
  }
}
```

---

## 3. Mixiny (`@mixin` / `@include`)

> **Plik definicji:** `scss/abstracts/_mixins.scss`

| Mixin | Parametry | Gdzie użyty |
|---|---|---|
| `respond-to($bp)` | `'sm'`/`'md'`/`'lg'`/`'xl'` | `_header.scss`, `_hero.scss`, `_sections.scss`, `_footer.scss`, `_placeholders.scss` |
| `flex-center($direction)` | `row` (def.) / `column` | `_hero.scss`, `_cards.scss`, `_board.scss`, `_footer.scss` |
| `flex-between` | — | `_header.scss`, `_footer.scss` |
| `card-grid($min-width)` | `280px` / `240px` | `_sections.scss` (zasady), `_cards.scss` (figury) |
| `glass($opacity, $blur)` | `0.08`, `16px` | `_placeholders.scss` → `%glass-card`, `_header.scss` |
| `gold-text` | — | `_header.scss`, `_hero.scss`, `_sections.scss`, `_footer.scss`, `_cards.scss` |
| `fade-in-up($delay, $distance)` | opóźnienie, odległość | definicja — używana pośrednio przez `_cards.scss` |
| `checkerboard-bg($light,$dark,$size)` | kolory + rozmiar | `_hero.scss`, `_sections.scss` |
| `absolute-center` | — | `_board.scss` (highlight, possible) |
| `gold-hover-glow` | — | `_cards.scss`, `_sections.scss` |
| `btn-base($padding-y, $padding-x)` | padding Y/X | `_buttons.scss`, `_header.scss` |
| `section-base` | — | `_sections.scss` (`.section`) |
| `gradient-border($width, $gradient, $radius)` | parametry obramowania | definicja w `_mixins.scss` |

**Przykład:**
```scss
// _mixins.scss
@mixin checkerboard-bg($light, $dark, $size: 40px) {
  $half: math.div($size, 2);    // ← sass:math + operator
  background-size: $size $size;
  ...
}

// _hero.scss — użycie
.hero {
  @include checkerboard-bg(rgba(255,255,255,0.025), transparent, 60px);
}
```

---

## 4. Dziedziczenie (`@extend` / `%placeholder`)

> **Plik definicji:** `scss/abstracts/_placeholders.scss`

| Placeholder | Opis | Gdzie rozszerzony |
|---|---|---|
| `%glass-card` | szkło z blur + border + shadow + hover | `.piece-card` (`_cards.scss`), `.rules__card` (`_sections.scss`) |
| `%container` | `max-width: 1200px` + `margin: 0 auto` + responsive padding | `.hero__inner`, `.header__nav`, `.section__container`, `.footer__inner`, `.cta-section__inner` |
| `%badge` | złota odznaka: border, background, uppercase | `.hero__badge`, `.piece-card__value` |
| `%section-header` | wyśrodkowany nagłówek z marginesem | `.section__header` |
| `%divider` | pozioma linia z gradientem złotym | `.section__divider` |
| `%interactive` | cursor + focus-visible + user-select | `.chessboard__square`, `.header__link`, `.footer__social-link`, `.footer__col-link` |
| `%dark-overlay` | ciemna nakładka `::before` | definicja dostępna, gotowa do użycia |

**Przykład:**
```scss
// _placeholders.scss
%glass-card {
  @include glass();           // ← mixin wewnątrz placeholdera
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  transition: all $transition-base;
  &:hover { @include glass(0.12); }
}

// _cards.scss
.piece-card {
  @extend %glass-card;        // ← dziedziczenie
}

// _sections.scss
.rules__card {
  @extend %glass-card;        // ← ten sam placeholder, dwa rozszerzenia
}
```

---

## 5. Operatory

> **Pliki:** `_variables.scss`, `_mixins.scss`, `_hero.scss`, `_board.scss`, `_buttons.scss`, `_cards.scss`, `_sections.scss`

| Wyrażenie | Wynik | Plik | Opis |
|---|---|---|---|
| `$spacing-xs * 1.5` | `6px` | `_buttons.scss:61` | Padding `.btn--sm` |
| `$spacing-md * 1.25` | `20px` | `_buttons.scss:66` | Padding `.btn--lg` |
| `$spacing-xl * 2` | `64px` | `_sections.scss` | Szerokość/wysokość cyfry zasady |
| `$header-height + $spacing-3xl` | `5rem + 4rem = 9rem` | `_hero.scss:38` | Offset `padding-top` hero |
| `$board-size + 80px` | `560px` | `_hero.scss:143` | Rozmiar poświaty szachownicy |
| `$square-size * 0.4` | `24px` | `_board.scss:102` | Rozmiar kropki `--highlight` |
| `$square-size * 0.3` | `18px` | `_board.scss:115` | Rozmiar kropki `--possible` |
| `$square-size * 0.72` | `43.2px` | `_board.scss:126` | Rozmiar figury szachowej |
| `$font-size-5xl * 0.8` | `64px` | `_cards.scss:31` | Ikona figury na karcie |
| `-$spacing-xs` | `-4px` | `_cards.scss:47`, `_sections.scss` | Ujemny margines |
| `math.div($size, 2)` | `size/2` | `_mixins.scss:67` | Połowa rozmiaru kafelki szachownicy |
| `$board-border-width * 0.5 - 4px` | `8px` | `_board.scss:54` | Pozycja etykiet kolumn |

---

## 6. Inne funkcjonalności

### `@use 'sass:math'` — wbudowany moduł Sass
```scss
// _mixins.scss:5
@use 'sass:math';

@mixin checkerboard-bg($size: 40px) {
  $half: math.div($size, 2);  // bezpieczne dzielenie (zamiast przestarzałego /)
}
```

### Funkcje kolorów SCSS (`lighten()`)
```scss
// _board.scss
&--light:hover {
  background-color: lighten($board-light-square, 8%);  // jaśniejszy o 8%
}
&--dark:hover {
  background-color: lighten($board-dark-square, 8%);
}
```

### `clamp()` z zmiennymi SCSS
```scss
// _hero.scss
font-size: clamp($font-size-3xl, 6vw, $font-size-5xl);
```

### `@keyframes` wewnątrz bloku BEM
```scss
// _hero.scss
.hero {
  @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
  @keyframes bounce { 0%, 100% { ... } 50% { ... } }
}
// _board.scss
@keyframes fadeInUp { from { opacity: 0; } to { opacity: 1; } }
```

### Selektory `nth-child` + animacje z opóźnieniem
```scss
// _cards.scss — kaskadowe wejście kart
.piece-card {
  &:nth-child(1) { animation: fadeInUp 0.5s 0.1s forwards; opacity: 0; }
  &:nth-child(2) { animation: fadeInUp 0.5s 0.2s forwards; opacity: 0; }
  // ... itd. dla 6 kart
}
```

### Partiale i `@import` (architektura 7-1 uproszczona)
```scss
// main.scss — kolejność importów gwarantuje poprawną kaskadę
@import 'base/variables';       // 1. abstrakcje
@import 'abstracts/mixins';
@import 'abstracts/placeholders';
@import 'base/reset';           // 2. baza
@import 'base/typography';
@import 'components/buttons';   // 3. komponenty
@import 'components/board';
@import 'components/cards';
@import 'layout/header';        // 4. layout
@import 'layout/hero';
@import 'layout/sections';
@import 'layout/footer';
```

---

## Podsumowanie — struktura plików

```
scss/
├── main.scss                    ← punkt wejścia, @import wszystkich partiali
├── abstracts/
│   ├── _mixins.scss             ← 13 mixinów (respond-to, flex-center, glass, btn-base…)
│   └── _placeholders.scss       ← 7 placeholderów (%glass-card, %container, %badge…)
├── base/
│   ├── _variables.scss          ← ~50 zmiennych (kolory, fonty, spacing, breakpoints…)
│   ├── _reset.scss              ← CSS reset + box-sizing
│   └── _typography.scss         ← Google Fonts + klasy pomocnicze (.gold-accent, .decorated-title)
├── components/
│   ├── _buttons.scss            ← .btn-primary, .btn-outline, .btn-ghost, .btn--sm/lg
│   ├── _board.scss              ← .chessboard BEM + @keyframes + lighten()
│   └── _cards.scss              ← .piece-card BEM + nth-child animations
└── layout/
    ├── _header.scss             ← .header BEM + fixed nav
    ├── _hero.scss               ← .hero BEM + @keyframes pulse/bounce
    ├── _sections.scss           ← .section (baza) + .rules
    └── _footer.scss             ← .footer BEM + responsive grid
```

> [!NOTE]
> Strona zawiera **3 sekcje główne**: `#hero` (szachownica + statystyki), `#figury` (6 kart figur), `#zasady` (6 kart reguł). Header i footer uzupełniają strukturę.
