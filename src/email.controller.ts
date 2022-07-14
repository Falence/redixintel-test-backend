import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Controller('email')
export class EmailController {
  constructor(
    private mailService: MailerService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @Post()
  async submitForm(@Body() user: User) {
    if (await this.userExists(user.email)) {
      return `exists`;
    }
    const newUser = await this.createUser(user);
    return this.sendEmail(newUser.email, newUser.name);
  }

  async createUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async userExists(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) return true;
    return false;
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
