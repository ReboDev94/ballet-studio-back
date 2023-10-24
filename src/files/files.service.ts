import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FilesService {
  private readonly logger = new Logger('FileService');
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET'),
    },
  });
  private readonly AWS_BUCKET =
    this.configService.getOrThrow('AWS_BUCKET_NAME');

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async uploadS3(
    file: Express.Multer.File,
    folder = '/',
    filename: string | null = null,
  ) {
    const { buffer, originalname, mimetype } = file;
    const [, fileType] = originalname.split('.');
    const fileName = filename ? filename : `${uuidV4()}.${fileType}`;

    const command = new PutObjectCommand({
      Bucket: this.AWS_BUCKET,
      Body: buffer,
      Key: `${folder}${fileName}`,
      ContentType: mimetype,
    });

    try {
      await this.s3Client.send(command);
      return {
        name: fileName,
      };
    } catch (error) {
      this.logger.error(error.message);
      return { key: 'errorS3', message: error.message };
    }
  }

  async deleteS3(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.AWS_BUCKET,
      Key: fileName,
    });
    try {
      await this.s3Client.send(command);
      return {
        success: true,
        message: 'file deleted',
      };
    } catch (error) {
      this.logger.error(error.message);
      return { key: 'errorS3', message: error.message };
    }
  }

  async getPresignedUrlS3(fileName: string, expire: number) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.AWS_BUCKET,
        Key: fileName,
      });

      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expire,
      });

      return url;
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }

  async convertFileAwsBase64(url: string) {
    const { data, headers } = await this.httpService.axiosRef({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
    });

    const typeFile = headers['content-type'];
    const fileBuffer = Buffer.from(data, 'binary').toString('base64');
    const base64File = `data:${typeFile};base64,${fileBuffer}`;

    return base64File;
  }
}
