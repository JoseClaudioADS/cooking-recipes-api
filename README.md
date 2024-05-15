# Cooking recipes API

### The recorded video course about building this API is published on... (Coming soon...) 

The purposes of this project are:
- Increase my portfolio.
- Teach people how to build an API using the approach technologies listed below.
- Record video course about building this API.

---

This is a project created to work with the WEB part implemented on the [Cooking Recipe WEB](https://github.com/JoseClaudioADS/cooking-recipes-web).

> This project follow the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) concepts.

This project uses:

- NodeJS
- Typescript
- Express JS
    - Morgan
    - Wiston Logger  
- Drizzle ORM
    - PostgreSQL
- Vitest
- Zod

**Pnpm** is the Package Manager.


## Setup

- Run `docker compose up -d` to start the Databse container.
- Run `pnpm db:migrate` to run the migration files.
- Run `pnpm db:seed` to generate test data.
- Run `pnpm start` to start the API at port 3000.
