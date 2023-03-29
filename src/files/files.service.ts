import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidV4 } from 'uuid';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  private readonly logger = new Logger('FileService');

  private AWS_BUCKET: string;
  constructor(private readonly configService: ConfigService) {
    this.AWS_BUCKET = this.configService.get('AWS_BUCKET_NAME');
  }

  async uploadS3(
    file: Express.Multer.File,
    folder = '/',
    filename: string | null = null,
  ) {
    const { buffer, originalname, mimetype } = file;
    const [, fileType] = originalname.split('.');
    const fileName = filename ? filename : `${uuidV4()}.${fileType}`;
    const s3 = new S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.AWS_BUCKET,
          Body: buffer,
          Key: `${folder}${fileName}`,
          ContentType: mimetype,
        })
        .promise();

      return {
        name: fileName,
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (error) {
      this.logger.error(error.message);
      return { key: 'errorS3', message: error.message };
    }
  }

  async deleteS3(fileName: string) {
    const s3 = new S3();
    try {
      await s3
        .deleteObject({
          Key: fileName,
          Bucket: this.AWS_BUCKET,
        })
        .promise();

      return {
        success: true,
        message: 'file deleted',
      };
    } catch (error) {
      this.logger.error(error.message);
      return { key: 'errorS3', message: error.message };
    }
  }

  async getPresignedUrlS3(fileName: string, expire = 900) {
    const s3 = new S3();
    try {
      const result = await s3.getSignedUrlPromise('getObject', {
        Key: fileName,
        Bucket: this.AWS_BUCKET,
        Expires: expire,
      });
      return result;
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}
