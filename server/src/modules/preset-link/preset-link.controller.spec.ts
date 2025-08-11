import { Test, TestingModule } from '@nestjs/testing';
import { PresetLinkController } from './preset-link.controller';
import { PresetLinkService } from './preset-link.service';

describe('PresetLinkController', () => {
  let controller: PresetLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetLinkController],
      providers: [PresetLinkService],
    }).compile();

    controller = module.get<PresetLinkController>(PresetLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
