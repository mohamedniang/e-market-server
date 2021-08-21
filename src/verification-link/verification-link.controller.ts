import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VerificationLink } from './verification-link.entity';
import { v4 } from 'uuid';
import { User } from '../user/user.entity';

@Controller('verification-link')
export class VerificationLinkController {
  @Get(':key')
  async getVerificationLink(@Param('key') key: string) {
    try {
      const link = await VerificationLink.findOneOrFail({
        where: { key },
        relations: ['account'],
      });
      console.log(link);
      if ((link.isValid = false)) {
        return { error: 1, message: 'this verification link is not valid' };
      }
      link.isValid = false;
      link.save();
      link.account.isVerified = true;
      link.account.save();
      return link;
    } catch (e) {
      console.error(e);
      return {
        error: 1,
        message: e,
      };
    }
  }
  @Post()
  async addLink(@Body() body) {
    console.log(`body`, body);
    const link = new VerificationLink();
    link.key = v4();
    link.account = await User.findOneOrFail(body.userId);
    return link.save();
  }
}
