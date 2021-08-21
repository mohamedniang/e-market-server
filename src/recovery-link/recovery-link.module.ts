import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RecoveryLinkController } from './recovery-link.controller';

@Module({
  controllers: [RecoveryLinkController],
  imports: [UserModule],
})
export class RecoveryLinkModule {}
