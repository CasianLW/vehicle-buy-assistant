import { Test, TestingModule } from '@nestjs/testing';
import { LeboncoinService } from './leboncoin.service';

describe('LeboncoinService', () => {
  let service: LeboncoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeboncoinService],
    }).compile();

    service = module.get<LeboncoinService>(LeboncoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
