import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { CreateMagicLinkService } from "../../magic-link/services/create-magic-link.service";
import { EmailAlreadyRegisteredError } from "../errors/email-already-registered.error";
import { UsersRepository } from "../repository/users.repository";
import { CreateUserInput, CreateUserUseCase } from "./create-user.use-case";

describe("CreateUserUseCase", () => {
  let useCase: CreateUserUseCase;
  let usersRepository: UsersRepository;
  let createMagicLinkService: CreateMagicLinkService;

  beforeAll(() => {
    usersRepository = {
      createUser: vi.fn(),
      findByEmail: vi.fn(),
    } as unknown as UsersRepository;

    createMagicLinkService = {
      execute: vi.fn(),
    } as unknown as CreateMagicLinkService;

    useCase = new CreateUserUseCase(usersRepository, createMagicLinkService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const input: CreateUserInput = {
      name: faker.person.fullName(),
      bio: faker.person.bio(),
      email: faker.internet.email().toLocaleLowerCase(),
    };

    const user = {
      id: faker.number.int(),
      name: input.name,
      bio: input.bio,
      email: input.email,
    };

    it("should create a user", async () => {
      vi.spyOn(usersRepository, "createUser").mockResolvedValueOnce({
        id: user.id,
      });
      vi.spyOn(createMagicLinkService, "execute").mockResolvedValueOnce({
        magicLink: faker.internet.url(),
      });

      const result = await useCase.execute(input);

      expect(result).toBe(user.id);
      expect(usersRepository.createUser).toHaveBeenCalledWith(input);
      expect(createMagicLinkService.execute).toHaveBeenCalledWith({ user });
    });

    it("should not create a user with a already registered email", async () => {
      vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce({
        id: faker.number.int(),
        email: input.email,
        name: faker.person.fullName(),
        bio: faker.person.bio(),
      });

      await expect(useCase.execute(input)).rejects.toThrow(
        new EmailAlreadyRegisteredError(input.email),
      );

      expect(usersRepository.createUser).not.toHaveBeenCalled();
      expect(createMagicLinkService.execute).not.toHaveBeenCalled();
    });
  });

  describe("given an invalid input", () => {
    const input: CreateUserInput = {
      name: "a",
      email: "invalid-email",
    };

    it("should not create a user", async () => {
      await expect(useCase.execute(input)).rejects.toThrow(ZodError);

      expect(usersRepository.findByEmail).not.toHaveBeenCalled();
      expect(usersRepository.createUser).not.toHaveBeenCalled();
    });
  });
});
