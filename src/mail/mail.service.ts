import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createMailDto } from './dto/createMailDto';
import { User } from 'src/auth/entities';
import { ConfigService } from '@nestjs/config';
import { ucwords } from 'src/common/utils';

@Injectable()
export class MailService {
  private BUSINESS_DATA = {
    businessName: '',
    businessUrl: '',
    businessPrivacyAndConditions: '',
    businessLogo: '',
  };

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
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
      console.log(error);
      throw new BadRequestException({ key: 'operations.EMAIL.NO_SENDING' });
    }
  }

  async sendConfirmationEmail(user: User) {
    const {
      businessLogo,
      businessName,
      businessPrivacyAndConditions,
      businessUrl,
    } = this.BUSINESS_DATA;
    const {
      email,
      name: userName,
      school: { id: schoolId, name: schoolName, logo: schoolLogo },
    } = user;

    console.log(user);
    return user;
    // await this.sendEmailCustomTemplate({
    //   to: email,
    //   subject: 'Confirma tu correo electrónico.',
    //   template: 'confirmation',
    //   context: {
    //     schoolName: schoolName.toUpperCase(),
    //     schoolLogo,
    //     userName: ucwords(userName),
    //     anio: new Date().getFullYear(),
    //     businessName,
    //     businessUrl,
    //     businessPrivacyAndConditions,
    //     businessLogo,
    //     urlConfirm: '' /* TODO:FALTA CREAR */,
    //   },
    // });

    /* TODO:
    -LOGO DE LA ESCUELA EXTRAER DE AWS
    Al momento de crear el usuario tambien crear un token de acceso a confirmar
    CREAR URL CONFIRM- AGREGAR PARAMETRO A TABLA USER CON EL TOKEN */
  }
}
