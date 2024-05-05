import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export const getMailerConfig = (
  configService: ConfigService,
): MailerOptions => ({
  template: {
    dir: path.resolve(__dirname, '..', '..', 'src/templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      extName: '.hbs',
      layoutsDir: path.resolve(__dirname, '..', '..', 'src/templates'),
    },
  },
  transport: {
    host: 'smtp.gmail.com',
    port: 465, // para SSL
    secure: true, // SSL/TLS
    auth: {
      user: configService.get('GMAIL_EMAIL'),
      pass: configService.get('GMAIL_PASSWORD'),
    },
  },
});
