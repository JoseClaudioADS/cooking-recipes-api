import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { usersRepositoryMock } from "../../../../tests/mocks/users-repository.mock";
import { User } from "../../users/entity/user";
import { UserByEmailNotFoundError } from "../../users/errors/user-by-email-not-found.error";
import { UsersRepository } from "../../users/repository/users.repository";
import { MagicLinkRepository } from "../repository/magic-link.repository";
import { CreateMagicLinkService } from "../services/create-magic-link.service";
import {
  CreateMagicLinkInput,
  CreateMagicLinkUseCase,
} from "./create-magic-link.user-case";

describe("CreateMagicLinkUseCase", () => {
  let useCase: CreateMagicLinkUseCase;
  let usersRepository: UsersRepository;
  let magicLinkRepository: MagicLinkRepository;
  let createMagicLinkService: CreateMagicLinkService;

  beforeAll(() => {
    usersRepository = usersRepositoryMock;

    createMagicLinkService = {
      execute: vi.fn(),
    } as unknown as CreateMagicLinkService;

    useCase = new CreateMagicLinkUseCase(
      usersRepository,
      magicLinkRepository,
      createMagicLinkService,
    );
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const input: CreateMagicLinkInput = {
      email: faker.internet.email().toLowerCase(),
    };

    const userDb = new User(
      faker.number.int(),
      faker.person.fullName(),
      faker.person.bio(),
      input.email,
    );

    it("should create a magic link", async () => {
      vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(userDb);
      vi.spyOn(createMagicLinkService, "execute").mockResolvedValueOnce({
        magicLink: faker.internet.url(),
      });

      const result = await useCase.execute(input);

      expect(result).toStrictEqual({
        magicLink: expect.stringMatching(/^https?:\/\/./u),
      });
      expect(createMagicLinkService.execute).toHaveBeenCalledWith({
        user: userDb,
      });
    });

    it("should not create a magic link if the user does not exist", async () => {
      vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(null);

      await expect(useCase.execute(input)).rejects.toThrow(
        new UserByEmailNotFoundError(input.email),
      );

      expect(createMagicLinkService.execute).not.toHaveBeenCalled();
    });
  });

  describe("given an invalid input", () => {
    const input: CreateMagicLinkInput = {
      email: "invalid-email",
    };

    it("should not create a magic link", async () => {
      await expect(useCase.execute(input)).rejects.toThrow(ZodError);

      expect(usersRepository.findByEmail).not.toHaveBeenCalled();
      expect(createMagicLinkService.execute).not.toHaveBeenCalled();
    });
  });
});
