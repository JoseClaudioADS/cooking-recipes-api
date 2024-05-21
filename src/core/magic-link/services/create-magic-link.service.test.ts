import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { magicLinkRepositoryMock } from "../../../../tests/mocks/magic-link-repository.mock";
import { User } from "../../users/entity/user";
import { MagicLinkRepository } from "../repository/magic-link.repository";
import {
  CreateMagicLinkInput,
  CreateMagicLinkService,
} from "../services/create-magic-link.service";

describe("CreateMagicLinkService", () => {
  let service: CreateMagicLinkService;
  let magicLinkRepository: MagicLinkRepository;

  beforeAll(() => {
    magicLinkRepository = magicLinkRepositoryMock;

    service = new CreateMagicLinkService(magicLinkRepository);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const userDb = new User(
      faker.number.int(),
      faker.person.fullName(),
      faker.person.bio(),
      faker.internet.email().toLowerCase(),
    );

    it("should create a magic link", async () => {
      vi.spyOn(magicLinkRepository, "createMagicLink").mockResolvedValueOnce();

      const result = await service.execute({ user: userDb });

      expect(result).toStrictEqual({
        magicLink: expect.stringMatching(/^https?:\/\/./u),
      });
    });

    it("should create a magic link and delete the previous", async () => {
      const magicLinkDb = {
        token: "token",
        user: userDb,
        createdAt: new Date(),
      };

      vi.spyOn(magicLinkRepository, "findByEmail").mockResolvedValueOnce(
        magicLinkDb,
      );
      vi.spyOn(magicLinkRepository, "createMagicLink").mockResolvedValueOnce();
      vi.spyOn(magicLinkRepository, "deleteMagicLink").mockResolvedValueOnce();

      const result = await service.execute({ user: userDb });

      expect(result).toStrictEqual({
        magicLink: expect.stringMatching(/^https?:\/\/./u),
      });
      expect(magicLinkRepository.deleteMagicLink).toHaveBeenCalledWith(
        magicLinkDb.token,
      );
    });
  });

  describe("given an invalid input", () => {
    const input: CreateMagicLinkInput = {
      user: null as unknown as User,
    };

    it("should not create a magic link", async () => {
      await expect(service.execute(input)).rejects.toThrow(ZodError);

      expect(magicLinkRepository.deleteMagicLink).not.toHaveBeenCalled();
      expect(magicLinkRepository.createMagicLink).not.toHaveBeenCalled();
    });
  });
});
