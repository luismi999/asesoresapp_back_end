import { Test, TestingModule } from '@nestjs/testing';
import { JoinsService } from './joins.service';

describe('JoinsService', () => {
  let service: JoinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinsService],
    }).compile();

    service = module.get<JoinsService>(JoinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
