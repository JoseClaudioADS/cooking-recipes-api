import { PrismaClient } from "@prisma/client";
import { PhotosRepository } from "../../core/photos/repository/photos.repository";
import {
  CreatePhotoRepositoryInput,
  CreatePhotoRepositoryOutput,
} from "../../core/photos/repository/types/create-photo.repository.type";

/**
 *
 */
export class PrismaPhotosRepository implements PhotosRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(
    createPhotoInput: CreatePhotoRepositoryInput,
  ): Promise<CreatePhotoRepositoryOutput> {
    const { filename } = createPhotoInput;

    const result = await this.prisma.photo.create({
      data: {
        filename,
      },
    });

    return { id: result.id };
  }
}
