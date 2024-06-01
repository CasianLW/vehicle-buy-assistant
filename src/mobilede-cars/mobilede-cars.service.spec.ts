import { Test, TestingModule } from '@nestjs/testing';
import { MobiledeCarsService } from './mobilede-cars.service';

describe('MobiledeCarsService', () => {
  let service: MobiledeCarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobiledeCarsService],
    }).compile();

    service = module.get<MobiledeCarsService>(MobiledeCarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
