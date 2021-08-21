import {
  EntitySubscriberInterface,
  InsertEvent,
  Connection,
  UpdateEvent,
  EventSubscriber,
} from 'typeorm';
import { Logger, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Email, Box } from './email.entity';

@Injectable()
@EventSubscriber()
export class EmailSubscriber implements EntitySubscriberInterface<Email> {
  constructor(@InjectConnection() readonly connection: Connection) {
    // connection.subscribers.push(this);
    Logger.log('init ...', 'new email');
  }

  listenTo() {
    return Email;
  }
  async afterInsert(event: InsertEvent<Email>) {
    Logger.log('afterInsert ' + event.entity, 'new email');
  }

  async afterUpdate(event: UpdateEvent<Email>) {
    Logger.log('afterUpdate ' + event.entity, 'new email');
  }
}
