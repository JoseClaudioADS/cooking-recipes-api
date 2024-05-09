import { UploadFileInput } from "./types/upload-file.service.type";

export interface UploadService {

    upload(file: UploadFileInput): Promise<void>;
}
