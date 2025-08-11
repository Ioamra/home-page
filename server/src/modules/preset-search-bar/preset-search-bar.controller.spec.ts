import { Test, TestingModule } from '@nestjs/testing';
import { PresetSearchBarController } from './preset-search-bar.controller';
import { PresetSearchBarService } from './preset-search-bar.service';

describe('PresetSearchBarController', () => {
  let controller: PresetSearchBarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresetSearchBarController],
      providers: [PresetSearchBarService],
    }).compile();

    controller = module.get<PresetSearchBarController>(PresetSearchBarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
