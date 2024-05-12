import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { AuthUser } from "../../shared/entity/auth-user";
import { UploadService } from "../../shared/services/upload.service";
import { PhotosRepository } from "../repository/photos.repository";
import { CreatePhotoInput, CreatePhotoUseCase } from "./create-photo.use-case";


describe("CreatePhotoUseCase", () => {

  let useCase: CreatePhotoUseCase;
  let photosRepository: PhotosRepository;
  let uploadService: UploadService;

  const authUser: AuthUser = {
    id: faker.number.int(),
    name: faker.name.firstName(),
    email: faker.internet.email()
  };

  beforeAll(() => {
    photosRepository = {
      create: vi.fn()
    } as unknown as PhotosRepository;

    uploadService = {
      upload: vi.fn()
    } as unknown as UploadService;

    useCase = new CreatePhotoUseCase(photosRepository, uploadService);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("given a valid input", () => {

    const input: CreatePhotoInput = {
      filename: faker.lorem.word(),
      data: Buffer.from([])
    };

    it("should create a photo", async () => {

      const repositoryOutput = { id: faker.number.int() };

      vi.spyOn(photosRepository, "create").mockResolvedValueOnce(repositoryOutput);

      const result = await useCase.execute(input, authUser);

      expect(result).toStrictEqual({
        id: repositoryOutput.id
      });
      expect(photosRepository.create).toHaveBeenCalledWith({ filename: expect.any(String) });
    });
  });

  describe("given an invalid input", () => {

    const input: CreatePhotoInput = {
      filename: "",
      data: 1 as unknown as Buffer
    };

    it("should not create a photo", async () => {
      await expect(useCase.execute(input, authUser)).rejects.toThrow(ZodError);

      expect(photosRepository.create).not.toHaveBeenCalled();
    });
  });
});
