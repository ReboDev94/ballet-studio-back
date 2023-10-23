import { Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesAuthService {
  constructor(private readonly fileService: FilesService) {}

  async generatePresignedUrlLogoUser(
    userId: number,
    photoName: string | null,
    expire = 900,
  ) {
    const url = photoName
      ? await this.fileService.getPresignedUrlS3(
          `user/${userId}/profile/${photoName}`,
          expire,
        )
      : null;
    return url;
  }

  async uploadLogoUser(
    file: Express.Multer.File,
    userId: number,
    photo: string | null,
  ) {
    const data = await this.fileService.uploadS3(
      file,
      `user/${userId}/profile/`,
      photo,
    );
    return data;
  }
}
