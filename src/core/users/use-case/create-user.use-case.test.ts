import { faker } from "@faker-js/faker";
import { describe, expect, it, vi } from "vitest";
import { UsersRepository } from "../repository/users.repository";
import { CreateUserInput, CreateUserUseCase } from "./create-user.use-case";


describe("CreateUserUseCase", () => {
    describe("given a valid input", () => {
        it("should create a user", async () => {

            const usersRepository: UsersRepository = {
                createUser: vi.fn()
            };

            vi.spyOn(usersRepository, "createUser").mockResolvedValueOnce({ id: 1 });

            const useCase = new CreateUserUseCase(usersRepository);

            const input: CreateUserInput = {
                name: faker.person.fullName(),
                profile: faker.person.bio(),
                email: faker.internet.email()
            };

            const result = await useCase.execute(input);

            expect(result).toBe(1);
        });
    });
});
