import { Module } from '@nestjs/common';
import { VideoCallService } from './video-call.service';
import { VideoCallController } from './video-call.controller';
import { VideoCallGateway } from './video-call.gateway';

@Module({
  providers: [VideoCallService, VideoCallGateway],
  controllers: [VideoCallController],
  exports: [VideoCallGateway],
})
export class VideoCallModule {}
