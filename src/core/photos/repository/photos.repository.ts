import { CreatePhotoRepositoryInput, CreatePhotoRepositoryOutput } from "./types/create-photo.repository.type";


export interface PhotosRepository {
  create(createPhotoInput: CreatePhotoRepositoryInput): Promise<CreatePhotoRepositoryOutput>;
}
