import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { MailtrapTransport } from 'mailtrap';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const isDevelopment = config.get('NODE_ENV') === 'development';
        const transportDevelopment = {
          host: config.get('MAILTRAP_HOST'),
          port: config.get('MAILTRAP_PORT'),
          auth: {
            user: config.get('MAILTRAP_USER'),
            pass: config.get('MAILTRAP_PASS'),
          },
          debug: isDevelopment,
          logger: isDevelopment,
        };

        const newTrasport = isDevelopment
          ? transportDevelopment
          : MailtrapTransport({
              token: config.get('MAILTRAP_TOKEN'),
            });

        return {
          transport: newTrasport,
          defaults: {
            from: config.get('FROM_DEFAULT_EMAIL'),
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(undefined, {
              inlineCssEnabled: true,
              inlineCssOptions: {
                url: ' ',
                preserveMediaQueries: true,
              },
            }),
            options: {
              strict: true,
            },
          },
        };
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
