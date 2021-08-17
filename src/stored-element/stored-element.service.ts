import { Injectable } from '@nestjs/common';
import { StoredElement } from './stored-element.entity';

@Injectable()
export class StoredElementService {
  async deleteSoteredElement(id: number) {
    return StoredElement.createQueryBuilder('stored_element')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
