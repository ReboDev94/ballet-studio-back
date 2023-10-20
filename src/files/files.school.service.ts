import { Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesSchoolService {
  constructor(private readonly fileService: FilesService) {}

  async generatePresignedUrlLogoSchool(schoolId: number, logo: string | null) {
    const url = logo
      ? await this.fileService.getPresignedUrlS3(
          `school/${schoolId}/profile/${logo}`,
        )
      : null;
    return url;
  }

  async uploadLogoSchool(
    file: Express.Multer.File,
    schoolId: number,
    logo: string,
  ) {
    const data = await this.fileService.uploadS3(
      file,
      `school/${schoolId}/profile/`,
      logo,
    );
    return data;
  }
}
