import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './email.controller';
import { google } from 'googleapis';
import { CreateAccessToken } from './createAccessToken';

// I've hardcoded these values because for some reason, I keep getting errors
// on Heroku after deploying
const CLIENT_ID =
  '227207303756-c49kv1l616v0h3lsudcvnnqcefg5b8ob.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN =
  '1//04Ho3MpYhH4PwCgYIARAAGAQSNwF-L9IrvAmKuLgsk7kfl80EqEQvn_K2NKC5n7D2LcScFTKkpnWRCooP1eUuohzaxC1ySfHRi4Q';

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
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: ACCESS_TOKEN,
        },
      },
    }),
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
