# JobPortal (Backend)

Backend service for the Job Portal built with Spring Boot.

**Prerequisites**
- Java 21 installed and `JAVA_HOME` configured.
- Maven (or use the bundled `mvnw` / `mvnw.cmd`).
- MongoDB running locally (or accessible remotely).

**Important**
- Do not commit secrets. Replace values in `src/main/resources/application.properties` with environment variables for production.

**Configuration**

1. MongoDB

   - Default URI in `application.properties`:
     `spring.data.mongodb.uri=mongodb://localhost:27017/jobportal`
   - Start a local MongoDB instance and ensure it accepts connections on `localhost:27017`.
   - Alternatively, set the environment variable to override the property:

     - PowerShell (temporary for session):
       ```powershell
       $env:SPRING_DATA_MONGODB_URI = 'mongodb://localhost:27017/jobportal'
       ```

     - Permanently, set system environment variables via Windows settings or your deployment platform.

   - Spring Data MongoDB will create collections automatically when the app runs.

2. Email (Gmail example)

   - Properties in `src/main/resources/application.properties`:
     - `spring.mail.host` (smtp.gmail.com)
     - `spring.mail.port` (587)
     - `spring.mail.username` (your email)
     - `spring.mail.password` (app password)

   - Recommended: do not store credentials in `application.properties`. Set them as environment variables:

     - PowerShell (session):
       ```powershell
       $env:SPRING_MAIL_USERNAME = 'your-email@gmail.com'
       $env:SPRING_MAIL_PASSWORD = 'your-app-password'
       ```

   - If using Gmail, create an App Password (recommended) and enable appropriate account access.

3. JWT & Other Secrets

   - Check `src/main/java/com/jobportal` and `src/main/resources` for any additional secret properties. Prefer environment variables (e.g., `SPRING_APPLICATION_JSON` or custom names).

**Database setup for beginners**

This project uses MongoDB. Below are three easy options to get a MongoDB instance running and connect the app.

Option A — Install MongoDB locally on Windows
- Download the Community Server MSI from https://www.mongodb.com/try/download/community and install.
- During installation choose “Install MongoDB as a Service” (recommended).
- Start the service (PowerShell as Admin):
  ```powershell
  net start MongoDB
  ```
- Verify with the shell:
  ```powershell
  mongosh "mongodb://localhost:27017"
  # then inside shell: show dbs
  ```
- App connection URI (default): `mongodb://localhost:27017/jobportal`.

Option B — Run MongoDB with Docker (no install)
- Requires Docker Desktop. Start a container with:
  ```powershell
  docker run -d --name jobportal-mongo -p 27017:27017 -v jobportal-mongo-data:/data/db mongo:6.0
  ```
- Or use `docker-compose.yml` and run `docker compose up -d`.
- Verify with `mongosh` or MongoDB Compass.

Option C — MongoDB Atlas (cloud)
- Create a free cluster on https://www.mongodb.com/cloud/atlas.
- Create a database user and add your IP to the whitelist (or allow your IP for testing).
- Use the provided connection string (starts with `mongodb+srv://...`) and set in `application.properties` or via environment variable.

Configure Spring Boot (safe overrides)
- The app reads `spring.data.mongodb.uri` from `src/main/resources/application.properties`.
- Prefer environment variables in development rather than editing files. Example (PowerShell session):
  ```powershell
  $env:SPRING_DATA_MONGODB_URI = 'mongodb://localhost:27017/jobportal'
  .\mvnw.cmd spring-boot:run
  ```
- Or pass the property when running:
  ```powershell
  .\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--spring.data.mongodb.uri=mongodb://localhost:27017/jobportal"
  ```

Quick verification (after DB is running)
- Connect with `mongosh`:
  ```powershell
  mongosh "mongodb://localhost:27017/jobportal"
  # inside shell: show collections
  ```
- Start the app and inspect logs for a successful MongoDB connection.

Seeding sample data (optional)
- Import JSON using `mongoimport`:
  ```powershell
  mongoimport --uri="mongodb://localhost:27017/jobportal" --collection=users --file=sample-users.json --jsonArray
  ```

Troubleshooting tips
- Connection refused: ensure MongoDB service/container is running and port 27017 is open.
- Atlas auth errors: verify username/password and IP whitelist.
- If collections are missing, Spring Data will create them when entities are persisted.

Security reminder: remove secrets (DB credentials, email passwords) from `src/main/resources/application.properties` before committing. Use environment variables or a secrets manager.

**Build & Run (local)**

- From project root (`JobPortal`):

  - Using the included Maven wrapper (Windows PowerShell):
    ```powershell
    .\mvnw.cmd clean package
    .\mvnw.cmd spring-boot:run
    ```

  - Or build and run the jar:
    ```powershell
    .\mvnw.cmd clean package
    java -jar target\JobPortal-0.0.1-SNAPSHOT.jar
    ```

  - Using system `mvn`:
    ```bash
    mvn clean package
    mvn spring-boot:run
    ```

**Run Tests**

- Run unit/integration tests:
  ```powershell
  .\mvnw.cmd test
  ```

**Common tasks**
- Change server port (if needed) in `application.properties`: `server.port=8080`.
- To run with custom properties without editing files:
  ```powershell
  .\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments="--spring.data.mongodb.uri=mongodb://host:27017/jobportal"
  ```

**Notes & Troubleshooting**
- If the app fails to connect to MongoDB, ensure the service is running and URIs/credentials are correct.
- If email sending fails, verify SMTP credentials and that your provider allows SMTP access.
- Check logs for startup errors (stack traces indicate missing properties or bean initialization problems).

**Project Layout (key folders)**
- `src/main/java/com/jobportal/api` — REST controllers (AuthAPI, JobAPI, UserAPI, etc.)
- `src/main/java/com/jobportal/dto` — DTO classes
- `src/main/java/com/jobportal/entity` — MongoDB entities
- `src/main/java/com/jobportal/repository` — Spring Data repositories
- `src/main/java/com/jobportal/service` — Business logic
- `src/main/java/com/jobportal/jwt` — JWT filters and utilities

If you want, I can also:
- Add a sample `.env` loader or Spring Boot profile for local development.
- Remove secrets from `application.properties` and move them to environment variable usage.

---
Generated by assistant — let me know if you want changes.
