import { Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesStudentService {
  constructor(private readonly fileService: FilesService) {}

  async getUrlSignedAvatar(
    studentId: number,
    avatarName: string | null,
    expire = 900,
  ) {
    const url = avatarName
      ? await this.fileService.getPresignedUrlS3(
          `student/${studentId}/profile/${avatarName}`,
          expire,
        )
      : null;
    return url;
  }

  async uploadLogoStudent(
    file: Express.Multer.File,
    studentId: number,
    photo: string | null = null,
  ) {
    const data = await this.fileService.uploadS3(
      file,
      `student/${studentId}/profile/`,
      photo,
    );
    return data;
  }
}
