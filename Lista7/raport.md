# Raport z implementacji serwera GraphQL

Niniejszy dokument przedstawia kompleksowy opis zaimplementowanego rozwiązania serwera GraphQL. Aplikacja została zbudowana na potrzeby zadania (Lista 7), by ukazać możliwości architektury GraphQL, w tym zapytania (Queries), modyfikacje (Mutations), komunikację w czasie rzeczywistym (Subscriptions/Events) oraz persystencję danych z wykorzystaniem bazy SQLite.

## Spis treści
1. [Wprowadzenie do GraphQL](#wprowadzenie-do-graphql)
2. [Architektura projektu](#architektura-projektu)
3. [Model Danych i Schemat (schema.graphql)](#model-danych-i-schemat)
4. [Logika Serwera i Resolvery (App.js)](#logika-serwera-i-resolvery)
5. [Warstwa Bazy Danych (db.js)](#warstwa-bazy-danych)
6. [Technologie i Biblioteki](#technologie-i-biblioteki)
7. [Podsumowanie i Działanie](#podsumowanie-i-dzialanie)

---

## 1. Wprowadzenie do GraphQL

GraphQL to język zapytań dla API, który stanowi alternatywę dla klasycznego podejścia REST. Największą zaletą GraphQL jest to, że klient (np. aplikacja webowa) definiuje strukturę danych, której dokładnie potrzebuje z powrotem. Wyróżniamy w nim trzy główne operacje:
* **Query** – operacje "Read", czyli pobieranie danych.
* **Mutation** – operacje "Create, Update, Delete", czyli modyfikacja danych.
* **Subscription** – subskrypcje (znane też jako eventy). Służą do utrzymywania stałego połączenia z serwerem i nasłuchiwania na reakcje pojawiające się w czasie rzeczywistym.

## 2. Architektura projektu

Kod naszej aplikacji API został podzielony w sposób modularny i czytelny:
* `src/schema.graphql` – plik, który służy jako definicja kształtu całego API (kontrakt między Front-endem a Back-endem).
* `src/App.js` – punkt wejściowy oraz serce aplikacji, które zawiera logikę biznesową przypisaną do operacji w API (tzw. "Resolvers").
* `src/db.js` – plik odpowiedzialny za zarządzanie połączeniem z relacyjną bazą danych (SQLite).

## 3. Model Danych i Schemat 

W pliku `schema.graphql` zdefiniowaliśmy strukturę węzłów naszej aplikacji: typy `User` i `ToDoItem`. Połączyliśmy je relacjami (Jeden użytkownik ma wiele Todo, każde Todo ma jednego właściciela).

Dodatkowo zdefiniowaliśmy pełen wachlarz akcji dla klienta:
* **Zapytania (`type Query`)**:
  - `users`, `user(id)` – do pobierania użytkowników
  - `todos`, `todo(id)` – do pobierania zadań
* **Mutacje (`type Mutation`)**:
  - Pełen zestaw operacji CRUD: `addUser`, `updateUser`, `deleteUser` i ich odpowiedniki dla `Todo`. Pozwalają one w pełni zarządzać stanem naszej aplikacji.
* **Subskrypcje (`type Subscription`)**:
  - `userAdded` i `todoAdded` pozwalające zewnętrznym aplikacjom być powiadamianym za każdym razem, kiedy zostanie wprowadzony zupełnie nowy wpis w bazie.

## 4. Logika Serwera i Resolvery 

W pliku `App.js` implementacja opiera się na przypięciu javascriptowych funkcji (resolverów) do tego, co oferuje schemat. Jest to tak zwane "mięso" logiki i odpowiada za faktyczne dostarczenie informacji.

* **Baza danych w resolverach** – Każdy resolver wywołuje instancję połączonej bazy (`getDb()`) i modyfikuje/odczytuje z niej w sposób asynchroniczny poprzez zapytania SQL. 
* **Zarządzanie relacjami** – Podeszliśmy profesjonalnie i dołączyliśmy sub-resolvery dla zagnieżdżonych struktur. To one dbają, by wpisanie pola `todos` podczas przepytywania użytkownika (Query `User`) zapytało bazę o zbiór `todos` pasujących tylko do tego połączonego kontekstem nadrzędnym `parent.id`.
* **System Eventów (PubSub)** –  Wykorzystujemy mechanizm PubSub z biblioteki `graphql-yoga`. Na końcach funkcji decyzyjnych od Mutacji poleceniem `pubSub.publish()` emitujemy zdarzenie o stworzeniu struktury na serwer. To wszystko natychmiast wraca kanałami np. WebSocketów do czekających odbiorców.

## 5. Warstwa Bazy Danych 

Plik `db.js` gwarantuje utrwalanie danych w projekcie:
* Na starcie plik sprawdza i otwiera dostęp do pliku `database.sqlite`. Następuje automatyczne przygotowanie pustych tabel (`CREATE TABLE IF NOT EXISTS`), z uwzględnieniem poprawnych kluczy obcych spajających `user_id` z odpowiednimi wpisami.
* **Proces Seedingowania** – Gdy skrypt stwierdzi, że świeżo stworzona baza nie posiada informacji, samodzielnie wykona połączenie HTTPS z publicznego środowiska REST API JsonPlaceholder i zaciągnie z niego realne dane próbne wypełniając bazę. Daje nam to pewność, że za każdym skasowaniem i próbą re-uruchomienia serwera będziemy od razu w stanie odczuć poprawność i gęstość zapytań GraphQL, ponieważ na stałe znajduje się pod nim w pełni wygenerowana tkanka wyników.

## 6. Technologie i Biblioteki

W tworzeniu API wykorzystane zostały następujące flagowe narzędzia:
* **graphql-yoga** – Zestaw narzędzi pozwalających błyskawicznie "zbudować" kompletny serwer z załadowanym silnikiem (obsługującym zapytania, mutacje, wsparciem dla wbudowanych Subskrypcji opartych w tej wersji o Event streams).
* **sqlite/sqlite3** – Paczki obsługujące relacyjną bazę danych zawartą w pliku stanowiącą rozwiązanie bardzo nowoczesne. 
* **axios** – lekki klient HTTP pomagający w wyzwalaniu zapytania na zewnątrz podczas automatycznego "zaludniania" bazy testami (Seeding).

## 7. Podsumowanie i Działanie

Aplikacja jest kompletnym i w pełni działającym rozwiązaniem na poziomie produkcyjno-testowym łącząc zalety wydajności języka zapytań z mocą relacyjnego szkieletu SQLite. 
Podsumowując funkcjonalność: Posiada wdrożoną strukturę mutacji do zarządzania użytkownikami oraz ich zdaniami. Posiada w pełni zautomatyzowany setup początkowy i dysponuje wbudowanym graficznym interfejsem GraphiQL aktywowanym domyślnie, dla wygody testujących serwer za pomocą przeglądarki. Dodatkowo spełnia najważniejsze, finalne kryterium postawione w tym module, dając w pełni elastyczną platformę opartą na Subskrypcjach, które posłużyć nam mogą do rozwijania oprogramowania powiadamiającego natychmiast o operacjach w projekcie w czasie rzeczywistym.
