import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { User } from "../entity/user";
import { UserByEmailNotFoundError } from "../errors/user-by-email-not-found.error";
import { UsersRepository } from "../repository/users.repository";
import { CreateMagicLinkInput, CreateMagicLinkUseCase } from "./create-magic-link.user-case";


describe("CreateMagicLinkUseCase", () => {

    let useCase: CreateMagicLinkUseCase;
    let usersRepository: UsersRepository;

    beforeAll(() => {
        usersRepository = {
            findByEmail: vi.fn(),
            createMagicLink: vi.fn()
        } as unknown as UsersRepository;

        useCase = new CreateMagicLinkUseCase(usersRepository);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("given a valid input", () => {

        const input: CreateMagicLinkInput = {
            email: faker.internet.email()
        };

        const userDb: User = {
            id: faker.number.int(),
            email: input.email,
            name: faker.person.fullName(),
            bio: faker.person.bio()
        };

        it("should create a magic link", async () => {

            vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(userDb);
            vi.spyOn(usersRepository, "createMagicLink").mockResolvedValueOnce();

            const result = await useCase.execute(input);

            expect(result).toStrictEqual({
                magicLink: expect.stringMatching(/^https?:\/\/./u)
            });
            expect(usersRepository.createMagicLink).toHaveBeenCalledWith(userDb, expect.any(String));
        });

        it("should not create a magic link if the user does not exist", async () => {

            vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(null);

            await expect(useCase.execute(input)).rejects.toThrow(new UserByEmailNotFoundError(input.email));

            expect(usersRepository.createMagicLink).not.toHaveBeenCalled();
        });
    });

    describe("given an invalid input", () => {

        const input: CreateMagicLinkInput = {
            email: "invalid-email"
        };

        it("should not create a magic link", async () => {
            await expect(useCase.execute(input)).rejects.toThrow(ZodError);

            expect(usersRepository.findByEmail).not.toHaveBeenCalled();
            expect(usersRepository.createMagicLink).not.toHaveBeenCalled();
        });
    });
});
