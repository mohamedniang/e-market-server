import { Test, TestingModule } from '@nestjs/testing';
import { StoredElementController } from './stored-element.controller';

describe('StoredElementController', () => {
  let controller: StoredElementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoredElementController],
    }).compile();

    controller = module.get<StoredElementController>(StoredElementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
