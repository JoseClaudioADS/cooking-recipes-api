import * as z from "zod";
import { PhotosRepository } from "../repository/photos.repository";

const createPhotoSchema = z.object({
    filename: z.string().min(2)
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;

export type CreatePhotoOutput = {
    id: number
}

/**
 *
 */
export class CreatePhotoUseCase {

    constructor(private readonly photosRepository: PhotosRepository) {}

    async execute(createPhotoInput: CreatePhotoInput): Promise<CreatePhotoOutput> {
        const { filename } = createPhotoSchema.parse(createPhotoInput);

        return this.photosRepository.create({
            filename
        });
    }
}
