# AERO Backend

Aplikacja Spring Boot (Kotlin) do ewidencji operacji lotniczych i zlecen na lot helikopterem.

## Wymagania

- Java 21
- Docker (opcjonalnie, do Oracle)

## Uruchamianie

### H2 (szybki development, bez Dockera)

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=h2'
```

- Start w ~5 sekund
- Baza in-memory (dane resetuja sie po restarcie)
- Schemat generowany automatycznie z encji (bez Flyway)

### Oracle + Docker Compose

```bash
cd backend
docker-compose up --build
```

- Start w ~90 sekund (Oracle wymaga inicjalizacji)
- Dane persistentne w Docker volume
- Flyway migracje + seed data
- Backend restartuje sie automatycznie az Oracle bedzie gotowy

### Oracle (lokalny)

```bash
cd backend
./gradlew bootRun
```

Wymaga Oracle na `localhost:1521/XEPDB1`, user `aero`/`aero`.

## Dostep

| URL | Opis |
|-----|------|
| http://localhost:8080/swagger-ui/index.html | Swagger UI |
| http://localhost:8080/v3/api-docs | OpenAPI JSON |
| http://localhost:8080/api/auth/login | Login endpoint |

## Konta testowe

Haslo do wszystkich kont: `password`

| Email | Rola |
|-------|------|
| admin@aero.pl | Administrator |
| planner@aero.pl | Osoba planujaca |
| supervisor@aero.pl | Osoba nadzorujaca |
| pilot@aero.pl | Pilot |

### Przyklad logowania

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aero.pl","password":"password"}'
```

Zwraca JWT token do uzycia w naglowku `Authorization: Bearer <token>`.

## Testy

```bash
# Wszystkie testy (wymaga Dockera — Testcontainers Oracle)
./gradlew test

# Tylko testy integracyjne logowania
./gradlew test --tests "pl.aerobrains.shared.security.AuthIntegrationSpec"

# Testy operacji lotniczych
./gradlew test --tests "pl.aerobrains.operations.FlightOperationSpec"

# Testy zlecen na lot
./gradlew test --tests "pl.aerobrains.orders.FlightOrderSpec"
```

## Generowanie OpenAPI spec

```bash
./gradlew test --tests "pl.aerobrains.OpenApiSpecGeneratorTest"
```

Zapisuje spec do `shared/api/openapi.json`. Frontend moze generowac typy TypeScript:

```bash
npx openapi-typescript ../shared/api/openapi.json -o src/api/types.ts
```

## Struktura projektu (DDD)

```
src/main/kotlin/pl/aerobrains/
├── shared/          — security (JWT, auth, users), config, exceptions
├── fleet/           — helikoptery, czlonkowie zalogi, ladowiska (CRUD)
├── operations/      — planowane operacje lotnicze (maszyna stanow, KML, GeoJSON)
└── orders/          — zlecenia na lot (walidacje, rozliczenie, kaskada statusow)
```
