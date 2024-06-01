import { Test, TestingModule } from '@nestjs/testing';
import { MobiledeCarsController } from './mobilede-cars.controller';

describe('MobiledeCarsController', () => {
  let controller: MobiledeCarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MobiledeCarsController],
    }).compile();

    controller = module.get<MobiledeCarsController>(MobiledeCarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
