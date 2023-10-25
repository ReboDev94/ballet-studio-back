import { Injectable } from '@nestjs/common';
import { FilesService } from './files.service';

@Injectable()
export class FilesSchoolService {
  constructor(private readonly fileService: FilesService) {}

  async generatePresignedUrlLogoSchool(
    schoolId: number,
    logo: string | null,
    expire = 900,
  ) {
    const url = logo
      ? await this.fileService.getPresignedUrlS3(
          `school/${schoolId}/profile/${logo}`,
          expire,
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

  async generateLogoSchoolBase64(schoolId: number, schoolLogo: string) {
    const logoUrl = await this.generatePresignedUrlLogoSchool(
      schoolId,
      schoolLogo,
      60,
    );
    const base64Url = await this.fileService.convertFileAwsBase64(logoUrl);
    return base64Url;
  }
}
