import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { VerificationLinkController } from './verification-link.controller';

@Module({
  controllers: [VerificationLinkController],
  imports: [UserModule],
})
export class VerificationLinkModule {}
