# Weryfikacja backendu — 24.09.2026

Pełny zestaw testów PostgreSQL: **52 passed**, bez pominiętych testów (145,14 s).
Testy wykonywano w izolowanych schematach osobnego lokalnego klastra PostgreSQL.
Cztery nowe testy regresji obejmują właściciela i wygaśnięcie sesji, nieaktywnych
użytkowników, pozycje klientów w różnych usługach, ograniczoną liczbę zapytań
o oferty oraz ustawienia puli połączeń.
Wystąpiło 1695 ostrzeżeń; nie oznacza to usunięcia wszystkich ostrzeżeń zależności.

## Zmiany

- Weryfikacja użytkownika i aktywnej sesji jednym zapytaniem SQL, z zachowaniem
  sprawdzania unieważnienia sesji oraz bieżącego stanu konta i roli.
- Wyznaczanie pozycji tylko dla potrzebnych usług, z uwzględnieniem wszystkich
  aktywnych klientów tych usług. HTTP i WebSocket współdzielą zapytanie.
- Pobieranie widocznych ofert wraz z usługami i ustawieniami, bez osobnych
  zapytań dla każdej oferty.
- Ograniczona pula PostgreSQL: `DB_POOL_SIZE=10`, `DB_MAX_OVERFLOW=0`,
  `DB_POOL_TIMEOUT=10`. Ustawienia dotyczą każdego procesu osobno; budżet
  połączeń musi uwzględniać łącznie API i proces push. Natychmiastowe aktualizacje
  wymagają obecnie jednego procesu roboczego API.
- Migracja `005_queue_read_index.sql` dodaje częściowy indeks klient/usługa
  dla aktywnych wpisów. Dwukrotnie zastosowano ją pomyślnie w obu lokalnych bazach.
  Nie zastosowano jej we wspólnej bazie zespołu.

## Ograniczony pomiar lokalny

`python -m scripts.profile_load --rounds 2` uruchamia tymczasowe API na lokalnym
porcie 8001, z wyłączonym mechanizmem czasowym i lokalną bazą demonstracyjną.
Każda runda loguje użytkownika testowego, otwiera 20 połączeń WebSocket, wykonuje
300 żądań GET (powiadomienia, status kolejki, oferty; współbieżność 20), po czym
zamyka połączenia i unieważnia tymczasową sesję.
Wpisy kolejki nie są zmieniane, a push nie jest wysyłany.

W porównaniu użyto lokalnej kopii z przywróconą wcześniejszą weryfikacją sesji
w dwóch zapytaniach, globalnym wyznaczaniem pozycji, odczytami dla każdej oferty
i domyślną pulą. Obie wersje używały tej samej bazy i indeksu, działały kolejno,
przy zatrzymanych Metro i testach. Opcjonalny argument `--app-root` wskazuje
taką kopię porównawczą; nie jest ona częścią repozytorium.
Wszystkie żądania HTTP i WebSocket trafiały na port 8001.

| Pomiar | Poprzednie działanie, rundy 1 / 2 | Po optymalizacji, rundy 1 / 2 |
|---|---:|---:|
| HTTP p95, ms | 687 / 677 | 354 / 388 |
| Żądania HTTP/s | 65.55 / 66.51 | 90.15 / 85.21 |
| Początkowa migawka WebSocket p95, ms | 1010 / 880 | 726 / 204 |
| Zapytania SQL na rundę | 1225 / 1225 | 904 / 904 |
| Otwarte połączenia z bazą, narastająco | 33 / 62 | 10 / 10 |

Każda runda zakończyła 300/300 żądań HTTP i 20/20 migawek bez błędów.
Wyniki zależą od komputera; wcześniejsze uruchomienia były wolniejsze.
Mały zestaw demonstracyjny jednego użytkownika nie określa wydajności produkcyjnej.
Test regresji ofert sprawdza liczbę zapytań dla czterech ofert; pomiar demonstracyjny
nie reprezentuje dużej liczby ofert. Nie zmierzono długotrwałych połączeń,
konkurencyjnych zapisów na dużą skalę, wielu instytucji, rozsyłania aktualizacji
ani przepustowości FCM.

## Uruchomienie i dalszy rozwój

Zastosować kolejno migracje 001–005, skonfigurować prywatny `.env` i skorzystać z:
[notifications-realtime.md](notifications-realtime.md),
[eta-confirmations.md](eta-confirmations.md) oraz [queue-offers.md](queue-offers.md).
Lokalny scenariusz demonstracyjny opisano w
[manual-browser-check.md](manual-browser-check.md).

Ręcznie zweryfikowano dostarczanie powiadomień push na Androidzie w tle
i przy otwartej aplikacji. Testy automatyczne używają testowej implementacji Firebase.

Dalszy rozwój obejmuje integrację ekranów mobilnych z API, konfigurację iOS/APNs
oraz rozszerzenie algorytmu o terminy kalendarzowe, godziny pracy i zasady zamykania dnia.
