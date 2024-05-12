import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { User } from "../../users/entity/user";
import { UserByEmailNotFoundError } from "../../users/errors/user-by-email-not-found.error";
import { UsersRepository } from "../../users/repository/users.repository";
import { MagicLinkRepository } from "../repository/magic-link.repository";
import {
  CreateMagicLinkInput,
  CreateMagicLinkUseCase,
} from "./create-magic-link.user-case";

describe("CreateMagicLinkUseCase", () => {
  let useCase: CreateMagicLinkUseCase;
  let usersRepository: UsersRepository;
  let magicLinkRepository: MagicLinkRepository;

  beforeAll(() => {
    usersRepository = {
      findByEmail: vi.fn(),
    } as unknown as UsersRepository;

    magicLinkRepository = {
      createMagicLink: vi.fn(),
      deleteMagicLink: vi.fn(),
      findByEmail: vi.fn(),
    } as unknown as MagicLinkRepository;

    useCase = new CreateMagicLinkUseCase(usersRepository, magicLinkRepository);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const input: CreateMagicLinkInput = {
      email: faker.internet.email().toLowerCase(),
    };

    const userDb: User = {
      id: faker.number.int(),
      email: input.email,
      name: faker.person.fullName(),
      bio: faker.person.bio(),
    };

    it("should create a magic link", async () => {
      vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(userDb);
      vi.spyOn(magicLinkRepository, "createMagicLink").mockResolvedValueOnce();
      vi.spyOn(magicLinkRepository, "deleteMagicLink").mockResolvedValueOnce();

      const result = await useCase.execute(input);

      expect(result).toStrictEqual({
        magicLink: expect.stringMatching(/^https?:\/\/./u),
      });
      expect(magicLinkRepository.deleteMagicLink).not.toHaveBeenCalled();
      expect(magicLinkRepository.createMagicLink).toHaveBeenCalledWith(
        userDb,
        expect.any(String),
      );
    });

    it("should create a magic link and delete the previous", async () => {
      const magicLinkDb = {
        token: "token",
        user: userDb,
        createdAt: new Date(),
      };

      vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(userDb);
      vi.spyOn(magicLinkRepository, "findByEmail").mockResolvedValueOnce(
        magicLinkDb,
      );
      vi.spyOn(magicLinkRepository, "createMagicLink").mockResolvedValueOnce();
      vi.spyOn(magicLinkRepository, "deleteMagicLink").mockResolvedValueOnce();

      const result = await useCase.execute(input);

      expect(result).toStrictEqual({
        magicLink: expect.stringMatching(/^https?:\/\/./u),
      });
      expect(magicLinkRepository.deleteMagicLink).toHaveBeenCalledWith(
        magicLinkDb.token,
      );
      expect(magicLinkRepository.createMagicLink).toHaveBeenCalledWith(
        userDb,
        expect.any(String),
      );
    });

    it("should not create a magic link if the user does not exist", async () => {
      vi.spyOn(usersRepository, "findByEmail").mockResolvedValueOnce(null);

      await expect(useCase.execute(input)).rejects.toThrow(
        new UserByEmailNotFoundError(input.email),
      );

      expect(magicLinkRepository.deleteMagicLink).not.toHaveBeenCalled();
      expect(magicLinkRepository.createMagicLink).not.toHaveBeenCalled();
    });
  });

  describe("given an invalid input", () => {
    const input: CreateMagicLinkInput = {
      email: "invalid-email",
    };

    it("should not create a magic link", async () => {
      await expect(useCase.execute(input)).rejects.toThrow(ZodError);

      expect(usersRepository.findByEmail).not.toHaveBeenCalled();
      expect(magicLinkRepository.deleteMagicLink).not.toHaveBeenCalled();
      expect(magicLinkRepository.createMagicLink).not.toHaveBeenCalled();
    });
  });
});
