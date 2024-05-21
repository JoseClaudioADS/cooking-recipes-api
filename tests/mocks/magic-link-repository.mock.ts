import { vi } from "vitest";
import { MagicLinkRepository } from "../../src/core/magic-link/repository/magic-link.repository";

export const magicLinkRepositoryMock = {
  createMagicLink: vi.fn(),
  deleteMagicLink: vi.fn(),
  findByEmail: vi.fn(),
  findByToken: vi.fn(),
} as unknown as MagicLinkRepository;
