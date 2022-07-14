import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './email.controller';
import { google } from 'googleapis';
import { CreateAccessToken } from './createAccessToken';
import * as config from 'config';

const googleConfig = config.get('google');
console.log(googleConfig);

const CLIENT_ID = googleConfig.CLIENT_ID;
const CLIENT_SECRET = googleConfig.CLIENT_SECRET;
const REDIRECT_URI = googleConfig.REDIRECT_URI;
const REFRESH_TOKEN = googleConfig.REFRESH_TOKEN;

export const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
export const ACCESS_TOKEN = new CreateAccessToken().generateAccessToken();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'falencelemungoh@gmail.com',
          clientId: process.env.CLIENT_ID || CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET || CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN || REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
        },
      },
    }),
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
