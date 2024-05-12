import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { PhotosRepository } from "../../../core/photos/repository/photos.repository";
import { CreatePhotoUseCase } from "../../../core/photos/use-case/create-photo.use-case";
import { AuthUser } from "../../../core/shared/entity/auth-user";
import { UploadService } from "../../../core/shared/services/upload.service";

/**
 *
 */
export class PhotosController {
  private readonly createPhotoUseCase: CreatePhotoUseCase;

  constructor(
    readonly photosRepiository: PhotosRepository,
    readonly uploadService: UploadService,
  ) {
    this.createPhotoUseCase = new CreatePhotoUseCase(
      photosRepiository,
      uploadService,
    );
  }

  async create(req: Request, res: Response): Promise<void> {
    const user = req.user;

    const file = req.files?.xzc as UploadedFile;

    await this.createPhotoUseCase.execute(
      {
        filename: file.name,
        data: file.data,
      },
      user as AuthUser,
    );

    res.sendStatus(201);
  }
}
