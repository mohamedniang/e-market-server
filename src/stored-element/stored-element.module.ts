import { Module } from '@nestjs/common';
import { StoredElementController } from './stored-element.controller';
import { StoredElementService } from './stored-element.service';

@Module({
  controllers: [StoredElementController],
  providers: [StoredElementService],
})
export class StoredElementModule {}
