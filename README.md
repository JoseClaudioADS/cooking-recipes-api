# Cooking recipes API

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
