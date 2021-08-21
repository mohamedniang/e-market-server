import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailSubscriber } from './email.subscriber';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [EmailService, EmailSubscriber],
  exports: [EmailService],
  imports: [UserModule],
  controllers: [EmailController],
})
export class EmailModule {}
