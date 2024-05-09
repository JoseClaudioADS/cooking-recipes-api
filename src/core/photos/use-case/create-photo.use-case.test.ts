import { faker } from "@faker-js/faker";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { PhotosRepository } from "../repository/photos.repository";
import { CreatePhotoInput, CreatePhotoUseCase } from "./create-photo.use-case";


describe("CreatePhotoUseCase", () => {

    let useCase: CreatePhotoUseCase;
    let photosRepository: PhotosRepository;

    beforeAll(() => {
        photosRepository = {
            create: vi.fn()
        } as unknown as PhotosRepository;

        useCase = new CreatePhotoUseCase(photosRepository);
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("given a valid input", () => {

        const input: CreatePhotoInput = {
            filename: faker.lorem.word()
        };

        it("should create a photo", async () => {

            const repositoryOutput = { id: faker.number.int() };

            vi.spyOn(photosRepository, "create").mockResolvedValueOnce(repositoryOutput);

            const result = await useCase.execute(input);

            expect(result).toStrictEqual({
                id: repositoryOutput.id
            });
            expect(photosRepository.create).toHaveBeenCalledWith({ filename: input.filename });
        });
    });

    describe("given an invalid input", () => {

        const input: CreatePhotoInput = {
            filename: ""
        };

        it("should not create a photo", async () => {
            await expect(useCase.execute(input)).rejects.toThrow(ZodError);

            expect(photosRepository.create).not.toHaveBeenCalled();
        });
    });
});
