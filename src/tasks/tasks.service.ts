import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from 'src/user/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('0 8 * * *')
  async handleCron() {
    this.logger.debug('Its 08:00 time to reset available sms for all user');
    await User.createQueryBuilder()
      .update()
      .set({ available_sms: 5 })
      .where('available_sms < :nbr', { nbr: 5 })
      .execute();
    this.logger.debug('Done ✅');
  }
}
