import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StoredElementService } from './stored-element.service';

@Controller('stored-element')
export class StoredElementController {
  constructor(private readonly storedElementService: StoredElementService) {}
  @Get()
  async getOne() {
    return 'hey !';
  }
  @Delete(':id')
  async deleteOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.storedElementService.deleteSoteredElement(id);
  }
}
