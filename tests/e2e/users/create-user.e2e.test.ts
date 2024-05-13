import { faker } from "@faker-js/faker";
import { describe, expect, it } from "vitest";

import { eq } from "drizzle-orm";
import { beforeEach } from "node:test";
import { db } from "../../../src/infra/db/drizzle-db";
import { usersTable } from "../../../src/infra/db/drizzle-db-schema";
import resetData from "../../db/reset-data";
import { api } from "../helpers/api";

describe("CreateUserE2E", () => {
  beforeEach(async () => {
    await resetData();
  });

  it("should create a user", async () => {
    const input = {
      name: faker.person.fullName(),
      bio: faker.person.bio(),
      email: faker.internet.email(),
    };

    const response = await api.post(`/users`, input);

    expect(response.status).toBe(201);

    const userDb = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, input.email.toLowerCase()),
    });

    expect(userDb).not.toBeUndefined();
    expect(userDb?.name).toBe(input.name);
    expect(userDb?.bio).toBe(input.bio);
  });
});
