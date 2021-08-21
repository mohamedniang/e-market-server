import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecoveryLink } from './recovery-link.entity';
import { v4 } from 'uuid';
import { User } from '../user/user.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Controller('recovery-link')
export class RecoveryLinkController {
  @Get(':key')
  async getRecoveryLink(@Param('key') key: string) {
    try {
      const link = await RecoveryLink.findOneOrFail({
        where: { key },
        relations: ['account'],
      });
      console.log(link);
      if ((link.isValid = false)) {
        return { error: 1, message: 'this recovery link is not valid' };
      }
      // link.isValid = false;
      // link.save();
      // link.account.isVerified = true;
      // link.account.save();
      return link;
    } catch (e) {
      console.error(e);
      return {
        error: 1,
        message: e,
      };
    }
  }

  @Post('reset/password/:key')
  async resetPassword(@Param('key') key: string, @Body() body) {
    console.log('resetting password', key, body);
    try {
      const link = await RecoveryLink.findOneOrFail({
        where: { key },
        relations: ['account'],
      });
      if (!link.isValid)
        return { error: 1, message: 'this recovery link is not valid' };

      link.isValid = false;
      link.save();

      link.account.password = await bcrypt.hash(body.new, 10);
      link.account.save();
      return link;
    } catch (e) {
      return {
        error: 1,
        message: e,
      };
    }
  }

  @Post()
  async addLink(@Body() body) {
    console.log(`body`, body);
    const link = new RecoveryLink();
    link.key = v4();
    link.account = await User.findOneOrFail(body.userId);
    return link.save();
  }
}
