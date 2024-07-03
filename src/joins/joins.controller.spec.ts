import { Test, TestingModule } from '@nestjs/testing';
import { JoinsController } from './joins.controller';
import { JoinsService } from './joins.service';

describe('JoinsController', () => {
  let controller: JoinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoinsController],
      providers: [JoinsService],
    }).compile();

    controller = module.get<JoinsController>(JoinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
