import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PhotosRepository } from "../../core/photos/repository/photos.repository";
import {
  CreatePhotoRepositoryInput,
  CreatePhotoRepositoryOutput,
} from "../../core/photos/repository/types/create-photo.repository.type";
import * as schema from "../db/drizzle-db-schema";
import { photosTable } from "../db/drizzle-db-schema";

/**
 *
 */
export class DrizzlePhotosRepository implements PhotosRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}
  async create(
    createPhotoInput: CreatePhotoRepositoryInput,
  ): Promise<CreatePhotoRepositoryOutput> {
    const { filename } = createPhotoInput;

    const result = await this.db
      .insert(photosTable)
      .values({ filename })
      .returning({ id: photosTable.id });

    return { id: result[0].id };
  }
}
