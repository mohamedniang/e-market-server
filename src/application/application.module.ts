import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
  imports: [EmailModule],
})
export class ApplicationModule {}
