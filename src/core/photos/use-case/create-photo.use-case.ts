import { randomUUID } from "crypto";
import * as z from "zod";
import logger from "../../../utils/logger";
import { AuthUser } from "../../shared/entity/auth-user";
import { UploadService } from "../../shared/services/upload.service";
import { PhotosRepository } from "../repository/photos.repository";

const createPhotoSchema = z.object({
    filename: z.string().min(2),
    data: z.instanceof(Buffer)
});

export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;

export type CreatePhotoOutput = {
    id: number
}

/**
 *
 */
export class CreatePhotoUseCase {

    constructor(private readonly photosRepository: PhotosRepository,
        private readonly uploadService: UploadService) {}

    async execute(createPhotoInput: CreatePhotoInput, user: AuthUser): Promise<CreatePhotoOutput> {
        const { filename, data } = createPhotoSchema.parse(createPhotoInput);

        const newFilename = `${randomUUID().toString()}.${filename.split(".").pop()}`;

        logger.info(`User ${JSON.stringify(user)} created a new photo. Filename: ${newFilename}`);

        await this.uploadService.upload({
            filename: newFilename,
            data
        });

        return this.photosRepository.create({
            filename: newFilename
        });
    }
}
