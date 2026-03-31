# AERO — Backend

## Opis projektu

Aplikacja webowa do ewidencji planowanych operacji lotniczych oraz przygotowania zleceń na lot helikopterem. Szczegóły w README.md (PRD).

## Stack technologiczny

| Warstwa | Technologia |
|---------|------------|
| Język | Kotlin |
| Framework | Spring Boot 3 |
| Build | Gradle (Kotlin DSL) |
| Baza danych | Oracle |
| Migracje | Flyway |
| ORM | Spring Data JPA / Hibernate |
| Security | Spring Security + JWT |
| Mapowanie DTO | MapStruct |
| Dokumentacja API | Springdoc OpenAPI |
| Testy jednostkowe | JUnit 5 |
| Testy integracyjne | Spock Framework + Testcontainers (Oracle XE) |

## Struktura repozytorium

```
backend/    — aplikacja Spring Boot (Kotlin)
frontend/   — (osobny projekt, poza zakresem)
shared/dto/ — współdzielone DTO między frontem a backendem
```

## Kluczowe decyzje

- Architektura DDD (Domain-Driven Design) — podział na bounded contexty, wyraźne oddzielenie warstw (domain, application, infrastructure)
- Monolit — brak potrzeby mikroserwisów
- Flyway do migracji bazy (nie Liquibase)
- Spock Framework do testów integracyjnych (Groovy DSL)
- MapStruct do mapowania entity <-> DTO
- JWT do autentykacji, Spring Security do autoryzacji (4 role: Administrator, Osoba planująca, Osoba nadzorująca, Pilot)
