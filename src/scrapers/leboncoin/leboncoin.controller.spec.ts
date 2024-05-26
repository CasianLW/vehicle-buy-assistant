import { Test, TestingModule } from '@nestjs/testing';
import { LeboncoinController } from './leboncoin.controller';

describe('LeboncoinController', () => {
  let controller: LeboncoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeboncoinController],
    }).compile();

    controller = module.get<LeboncoinController>(LeboncoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
