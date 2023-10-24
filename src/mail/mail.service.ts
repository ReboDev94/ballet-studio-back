import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createMailDto } from './dto/createMailDto';
import { User } from 'src/auth/entities';
import { ConfigService } from '@nestjs/config';
import { ucwords } from 'src/common/utils';
import { FilesSchoolService } from 'src/files/files.school.service';

@Injectable()
export class MailService {
  private FRONT_URL_RESET_PASSWORD: string;
  private FRONT_URL_CONFIRM_ACCOUNT: string;
  private BUSINESS_DATA = {
    businessName: '',
    businessUrl: '',
    businessPrivacyAndConditions: '',
    businessLogo: '',
  };

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly fileSchoolService: FilesSchoolService,
  ) {
    this.FRONT_URL_CONFIRM_ACCOUNT = `${this.configService.get(
      'FRONT_URL',
    )}/${this.configService.get('FRONT_URL_CONFIRM_ACCOUNT')}`;

    this.FRONT_URL_RESET_PASSWORD = `${this.configService.get(
      'FRONT_URL',
    )}/${this.configService.get('FRONT_URL_RESET_PASSWORD')}`;

    this.BUSINESS_DATA = {
      businessName: this.configService.get('BUSINESS_NAME'),
      businessUrl: this.configService.get('BUSINESS_URL'),
      businessPrivacyAndConditions: this.configService.get(
        'BUSINESS_PRIVACY_AND_CONDITIONS',
      ),
      businessLogo: this.configService.get('BUSINESS_LOGO'),
    };
  }

  private async sendEmailCustomTemplate(data: createMailDto) {
    try {
      await this.mailerService.sendMail({
        ...data,
      });
    } catch (error) {
      throw new BadRequestException({ key: 'operations.EMAIL.NO_SENDING' });
    }
  }

  private async defaultData(user: User) {
    const {
      businessLogo,
      businessName,
      businessPrivacyAndConditions,
      businessUrl,
    } = this.BUSINESS_DATA;
    const { email, name: userName } = user;

    let schoolLogoBase64 = '';
    let schoolName = '';
    if (user.school) {
      const { id: schoolId, logo: schoolLogo, name } = user.school;
      schoolName = name;
      schoolLogoBase64 = await this.fileSchoolService.generateLogoSchoolBase64(
        schoolId,
        schoolLogo,
      );
    }

    return {
      to: email,
      context: {
        schoolName: schoolName.toUpperCase(),
        schoolLogo: schoolLogoBase64,
        userName: ucwords(userName),
        anio: new Date().getFullYear(),
        businessName,
        businessUrl,
        businessPrivacyAndConditions,
        businessLogo,
      },
    };
  }

  async sendResetPassword(user: User, token: string) {
    const urlReset = `${this.FRONT_URL_RESET_PASSWORD.replace(
      ':token',
      token,
    )}?email=${user.email}`;

    const data = await this.defaultData(user);
    await this.sendEmailCustomTemplate({
      ...data,
      subject: 'Restablece tu contraseña',
      template: 'reset-password',
      context: {
        ...data.context,
        urlReset,
      },
    });
  }

  async sendConfirmationEmail(user: User, token: string) {
    const urlConfirm = `${this.FRONT_URL_CONFIRM_ACCOUNT.replace(
      ':token',
      token,
    )}?email=${user.email}`;

    const data = await this.defaultData(user);
    await this.sendEmailCustomTemplate({
      ...data,
      subject: 'Confirma tu correo electrónico.',
      template: 'confirmation',
      context: {
        ...data.context,
        urlConfirm,
      },
    });
  }
}
