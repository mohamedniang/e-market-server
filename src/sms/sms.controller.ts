import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { User } from 'src/user/user.entity';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'), RoleGuard) // use both guard in the function instead of the class to get req.user and added 'jwt' for challenge bug in authGuard
  @Role('member')
  async sendSms(@Param('id') id: string, @Body() { body }, @Req() req) {
    const receiver = await User.findOneOrFail({
      where: { id },
      select: ['phone'],
    });
    const sender = await User.findOneOrFail({
      where: { id: req.user.id },
      select: ['id', 'available_sms'],
    });
    console.log('sms user', receiver, body, req.user, sender.available_sms);
    sender.available_sms > 0 ? sender.available_sms-- : sender.available_sms;
    sender.save();
    if (sender.available_sms == 0)
      return {
        error: 1,
        message: 'You cannot send more sms for today, wait until tomorrow',
      };
    return await this.smsService.send(receiver.phone, body);
  }
}
