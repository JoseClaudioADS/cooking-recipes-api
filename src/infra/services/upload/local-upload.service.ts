import { mkdir, writeFile } from "fs/promises";
import { UploadFileInput } from "../../../core/shared/services/types/upload-file.service.type";
import { UploadService } from "../../../core/shared/services/upload.service";
import env from "../../../utils/env";

/**
 *
 */
export class LocalUploadService implements UploadService {
  // eslint-disable-next-line class-methods-use-this -- Disabling because it's just for test purposes
  async upload(file: UploadFileInput): Promise<void> {
    await mkdir(`./public${env.UPLOAD_FILE_PATH}`, { recursive: true });
    await writeFile(
      `./public${env.UPLOAD_FILE_PATH}/${file.filename}`,
      file.data,
    );
  }

  // eslint-disable-next-line class-methods-use-this -- Disabling because it's just for test purposes
  getUrl(filename: string): string {
    return `${env.API_URL}${env.UPLOAD_FILE_PATH}/${filename}`;
  }
}
