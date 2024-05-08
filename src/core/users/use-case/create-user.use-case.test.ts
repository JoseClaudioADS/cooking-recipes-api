import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { EmailAlreadyRegisteredError } from "../errors/email-already-registered.error";
import { UsersRepository } from "../repository/users.repository";
import { CreateUserInput, CreateUserUseCase } from "./create-user.use-case";


describe("CreateUserUseCase", () => {

    let useCase: CreateUserUseCase;
    let usersRepository: UsersRepository;

    beforeAll(() => {
        usersRepository = {
            createUser: vi.fn(),
            findByEmail: vi.fn()
        };

        useCase = new CreateUserUseCase(usersRepository);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("given a valid input", () => {

        const input: CreateUserInput = {
            name: faker.person.fullName(),
            profile: faker.person.bio(),
            email: faker.internet.email()
        };

        it("should create a user", async () => {

            vi.spyOn(usersRepository, "createUser").mockResolvedValueOnce({ id: 1 });

            const result = await useCase.execute(input);

            expect(result).toBe(1);
        });

        it("should not create a user with a already registered email", async () => {

            vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce({
                id: faker.number.int(),
                email: input.email,
                name: faker.person.fullName(),
                profile: faker.person.bio()
            });

            await expect(useCase.execute(input)).rejects.toThrow(new EmailAlreadyRegisteredError(input.email));

            expect(usersRepository.createUser).not.toHaveBeenCalled();
        });
    });
});
