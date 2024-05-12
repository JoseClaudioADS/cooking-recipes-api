import { faker } from "@faker-js/faker";
import { sign } from "jsonwebtoken";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import env from "../../../utils/env";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error";
import { User } from "../../users/entity/user";
import { MagicLinkRepository } from "../repository/magic-link.repository";
import { SignInMagicLinkInput, SignInMagicLinkUseCase } from "./sign-in-magic-link.user-case";


describe("SignInMagicLinkUseCase", () => {

  let useCase: SignInMagicLinkUseCase;
  let magicLinkRepository: MagicLinkRepository;

  beforeAll(() => {
    magicLinkRepository = {
      findByToken: vi.fn(),
      deleteMagicLink: vi.fn()
    } as unknown as MagicLinkRepository;

    useCase = new SignInMagicLinkUseCase(magicLinkRepository);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {
    const userDb: User = {
      id: faker.number.int(),
      email: faker.internet.email().toLowerCase(),
      name: faker.person.fullName(),
      bio: faker.person.bio()
    };

    const input: SignInMagicLinkInput = {
      token: sign({ email: userDb.email }, env.JWT_SECRET_KEY, { expiresIn: env.JWT_EXPIRATION_TIME })
    };

    it("should sign in via magic link", async () => {

      vi.spyOn(magicLinkRepository, "findByToken").mockResolvedValueOnce({
        token: input.token,
        user: userDb,
        createdAt: new Date()
      });

      const result = await useCase.execute(input);

      expect(result).toStrictEqual({
        token: expect.any(String)
      });
      expect(magicLinkRepository.deleteMagicLink).toHaveBeenCalledWith(input.token);
    });

    it("should not sign in via magic link when the token is invalid", async () => {

      await expect(useCase.execute({ token: "invalid" })).rejects.toThrow(UnauthorizedError);

      expect(magicLinkRepository.findByToken).not.toHaveBeenCalled();
    });
  });

  describe("given an invalid input", () => {

    const input: SignInMagicLinkInput = {
      token: ""
    };

    it("should not sign in", async () => {
      await expect(useCase.execute(input)).rejects.toThrow(ZodError);

      expect(magicLinkRepository.findByToken).not.toHaveBeenCalled();
    });
  });
});
