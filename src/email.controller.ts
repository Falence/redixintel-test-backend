import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('email')
export class EmailController {
  constructor(private mailService: MailerService) {}

  @Post()
  async submitForm(@Body('email') email: string, @Body('name') name: string) {
    return this.sendEmail(email, name);
  }

  async sendEmail(email: string, name: string) {
    try {
      await this.mailService.sendMail({
        from: 'REDIXINTEL <falencelemungoh@gmail.com>',
        to: email,
        subject: `Hello ${name.split(' ')[0].toUpperCase()}`,
        text: `We are glad to have you on board.\nWe have received your information and will start processing it immediately.\nRegards, Support.`,
        html: `
          <h1>We are glad to have you on board.</h1>
          <p>We have received your information and will start processing it immediately</p>
          <br>
          <p>Regards, REDIXINTEL Support.</p>
        `,
      });
      return 'success';
    } catch (error) {
      console.log(error);
      return 'fail';
    }
  }
}
