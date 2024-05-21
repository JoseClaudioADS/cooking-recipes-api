import { vi } from "vitest";
import { UsersRepository } from "../../src/core/users/repository/users.repository";

export const usersRepositoryMock = {
  findByEmail: vi.fn(),
  createUser: vi.fn(),
} as unknown as UsersRepository;
