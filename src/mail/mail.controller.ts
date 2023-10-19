import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async sendMailTesting() {
    await this.mailService.sendEmailCustomTemplate({
      to: 'rrrrebolledohdz@gmail.com',
      subject: 'Confirmar tu correo',
      template: 'confirmation',
      context: {
        name: 'Rafael de jesus',
      },
    });
    return 'hola';
  }
}
