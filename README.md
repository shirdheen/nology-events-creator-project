# Project Overview

A full-stack calendar app built with React and Spring Boot to create, view, and manage events, featuring filtering, week, and day views. It has been deployed via Github pages and Azure.

---

## Live Demo

- **Frontend:** https://shirdheen.github.io/nology-events-creator-project/
- **Backend:** https://eventscreator-backend.azurewebsites.net/events

---

## Features

- Weekly and daily calendar view
- Add, update, and delete events
- Filter by label and location
- Backend validation & error handling
- CI/CD pipelines (Github Actions)
- Azure MySQL (prod) + H2 (test)

---

## Frontend

- **Framework:** React + Vite + TypeScript
- **Styling:** SCSS
- **Deployment:** Github Pages via `gh-pages`

### Setup

```bash
cd frontend
npm install
npm run dev
```

### Manual Deployment

```bash
npm run deploy
```

Make sure `package.json` includes:

```json
"homepage": "https://<username>.github.io/<repo-name>"
```

---

## Backend

- **Framework:** Spring Boot (Java 21)
- **Database:** MySQL (Azure), H2 (test)
- **Deployment:** Azure App Service

### Profiles

- `prod` - production profile for Azure
- `test` - test profile for integration tests

### Setup

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Update `application.properties` with your local DB config.

### API Overview

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/events`      | Fetch all events |
| GET    | `/events/{id}` | Get event by ID  |
| POST   | `/events`      | Create event     |
| PUT    | `/events/{id}` | Update event     |
| DELETE | `/events/{id}` | Delete event     |

---

## CI/CD

### Backend

- Located at `.github/workflows/backend.yml`
- On push to main:
  - Run tests
  - Build JAR
  - Deploy to Azure via publish profile secret

### Frontend

- Located at `.github/workflows/frontend.yml`
- On push to main:
  - Install dependencies
  - Build app
  - Deploy to Github Pages using `peaceiris/actions-gh-pages`

---

## Azure Environment Variables

Set these under App Service → Configuration:

| Key                        | Value                                                                            |
| -------------------------- | -------------------------------------------------------------------------------- |
| SPRING_PROFILES_ACTIVE     | `prod`                                                                           |
| SPRING_DATASOURCE_URL      | `jdbc:mysql://<your-db-name>.mysql.database.azure.com:3306/<your-database-name>` |
| SPRING_DATASOURCE_USERNAME | your-db-username                                                                 |
| SPRING_DATASOURCE_PASSWORD | your-db-password                                                                 |

---

## Testing

- Uses `@WebMvcTest`, `@SpringBootTest`, and H2 in-memory DB.
- Run with:

```bash
./mnvw test
```

---
