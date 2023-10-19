import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createMailDto } from './dto/createMailDto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailCustomTemplate(data: createMailDto) {
    try {
      await this.mailerService.sendMail({
        ...data,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException({ key: 'operations.EMAIL.NO_SENDING' });
    }
  }
}
