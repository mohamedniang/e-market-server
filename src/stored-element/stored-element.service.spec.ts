import { Test, TestingModule } from '@nestjs/testing';
import { StoredElementService } from './stored-element.service';

describe('StoredElementService', () => {
  let service: StoredElementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoredElementService],
    }).compile();

    service = module.get<StoredElementService>(StoredElementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
