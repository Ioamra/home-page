import { Test, TestingModule } from '@nestjs/testing';
import { PresetBackgroundController } from './preset-background.controller';
import { PresetBackgroundService } from './preset-background.service';

describe('PresetBackgroundController', () => {
  let controller: PresetBackgroundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetBackgroundController],
      providers: [PresetBackgroundService],
    }).compile();

    controller = module.get<PresetBackgroundController>(PresetBackgroundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
