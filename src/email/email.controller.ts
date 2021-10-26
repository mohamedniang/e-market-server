import { EmailService } from './email.service';
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { Email, Box } from './email.entity';
import { VerificationLink } from '../verification-link/verification-link.entity';
import { v4 } from 'uuid';
import { UserService } from '../user/user.service';
import { RecoveryLink } from 'src/recovery-link/recovery-link.entity';
import { ConfigService } from '@nestjs/config';

@Controller('email')
// @UseGuards(AuthGuard())
export class EmailController {
  constructor(
    private emailService: EmailService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
    this.verificationUrl =
      this.configService.get('NODE_ENV') == 'development'
        ? this.configService.get('DEV_PLATFORM_SERVER_URL')
        : this.configService.get('PROD_PLATFORM_SERVER_URL');
  }

  test_email = 'mouhamedniang1997@gmail.com';
  private verificationUrl: string;

  @Get(':id')
  async get(@Param('id', new ParseIntPipe()) id: number) {
    return Email.findOneOrFail(id);
  }

  @Post('send')
  async send(@Body() email: Email) {
    console.log('emailController', email);
    const result = await this.emailService.send(email);
    console.log(`result`, result);
    return result;
  }

  @Post('send/verification/:id')
  async sendVerification(@Param('id') id: string) {
    const now = new Date();
    console.log('sendVerification', id, now);
    const link = await VerificationLink.findOneOrFail({
      where: { account: { id } },
      relations: ['account'],
    });
    link.key = v4();
    if (link.resend_date.getTime() > now.getTime()) {
      return {
        error: 11,
        message: 'Cannot resend a verification email now',
        date: link.resend_date,
      };
    }
    const result = await this.emailService.send({
      from: this.test_email, // sender address
      to: link.account.email, // list of receivers
      subject: 'You have successfully registered to iphone flipping !', // Subject line
      text: 'click this verification link: verify my account', // plain text body
      html: `<p>click this verification link: <a href="${this.verificationUrl}/account/verification/${link.key}">verify my account</a></p>`, // html body
    });
    link.resend_date = new Date(new Date().getTime() + 30 * 60 * 1000); // push the resend_date to 30min
    link.save();
    return result;
  }

  @Post('create/verification/:email')
  async createVerification(@Param('email') email: string) {
    try {
      console.log('createVerification', email);
      const user = await this.userService.findByEmail(email); // we get the email from userService just to fire an error if it does not exist in the DB
      const existingLink = await VerificationLink.findOne({
        where: { account: { email } },
        relations: ['account'],
      });
      console.log(`existingLink`, existingLink, user);
      if (existingLink) {
        if (existingLink.isValid) {
          if (
            !existingLink.account.isVerified &&
            existingLink.resend_date.getTime() > new Date().getTime()
          ) {
            // if link is valid + user not verified + we cannot resend
            return {
              error: 1,
              message:
                'A verification link is already sent to this email wait 24h before being able to resend another one',
            };
          } else if (
            !existingLink.account.isVerified &&
            existingLink.resend_date.getTime() < new Date().getTime()
          ) {
            // if link is valid + user not verified + we CAN resend
            existingLink.resend_date = new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000,
            );
            existingLink.save();
            return await this.emailService.send({
              from: this.test_email, // sender address
              to: this.test_email, // list of receivers
              subject: 'You have successfully registered to iphone flipping !', // Subject line
              text: 'click this verification link: verify my account', // plain text body
              html: `<p>click this verification link: <a href="${this.verificationUrl}/account/verification/${existingLink.key}">verify my account</a></p>`, // html body
            });
          }
        } else if (existingLink.account.isVerified) {
          return {
            error: 1,
            message: 'The account linked to this email is already verified',
          };
        } else {
          const del = await VerificationLink.delete(existingLink.id);
          console.log('deleted verification link', del);
        }
      }

      const link = new VerificationLink();
      link.key = v4();
      link.account = user;
      link.resend_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      link.save();

      const result = await this.emailService.send({
        from: this.test_email, // sender address
        to: email, // list of receivers
        subject: 'You have successfully registered to iphone flipping !', // Subject line
        text: 'click this verification link: verify my account', // plain text body
        html: `<p>click this verification link: <a href="${this.verificationUrl}/account/verification/${link.key}">verify my account</a></p>`, // html body
      });
      // link.resend_date = new Date(new Date().getTime() + 30 * 60 * 1000); // push the resend_date to 30min
      return result;
    } catch (e) {
      console.error(e);
      return {
        error: 1,
        message: e.message ? e.message : e,
      };
    }
  }

  @Post('create/recovery/:email')
  async createRecovery(@Param('email') email: string) {
    const now = new Date();
    try {
      console.log('sendRecovery', email);
      const user = await this.userService.findByEmail(email);
      const existingLink = await RecoveryLink.findOne({
        where: { account: { email } },
        relations: ['account'],
      });
      console.log(`existingLink`, existingLink);
      if (existingLink) {
        if (existingLink.isValid) {
          return {
            error: 1,
            message: 'A password recovery link is already sent to this email',
          };
        } else if (existingLink.resend_date.getTime() > now.getTime()) {
          return {
            error: 11,
            message: 'Cannot resend a recovery email now',
            date: existingLink.resend_date,
          };
        } else {
          await RecoveryLink.delete(existingLink);
        }
      }
      const link = new RecoveryLink();
      link.key = v4();
      link.account = user;
      link.resend_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      link.save();
      const result = await this.emailService.send({
        from: this.test_email, // sender address
        to: email, // list of receivers
        subject: 'You requesting a password recovery to iphone flipping !', // Subject line
        text: 'click this link: change my password', // plain text body
        html: `<p>click this link: <a href="${this.verificationUrl}/account/password/change/${link.key}">change my password</a></p>`, // html body
      });
      // link.resend_date = new Date(new Date().getTime() + 30 * 60 * 1000); // push the resend_date to 30min
      return result;
    } catch (e) {
      console.error(e);
      return {
        error: 1,
        message: e.message ? e.message : e,
      };
    }
  }

  @Put(':id')
  async put(@Param('id', new ParseIntPipe()) id: number, @Body() email: Email) {
    return await email.save();
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number) {
    return await Object.assign(new Email(), { id, box: Box.DELETED }).save();
  }
}
